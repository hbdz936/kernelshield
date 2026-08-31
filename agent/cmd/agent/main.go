package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	ctx "github.com/yourcompany/kernelshield/agent/internal/context"
	"github.com/yourcompany/kernelshield/agent/internal/ebpf"
	"github.com/yourcompany/kernelshield/agent/internal/engine"
	"github.com/yourcompany/kernelshield/agent/internal/sensors"
)

func main() {
	log.Println("==========================================================")
	log.Println("     KERNELSHIELD - RANSOMWARE DEFENSE AGENT (v1.0.0)     ")
	log.Println("        'One Kernel, Four Sensors, One Brain'             ")
	log.Println("==========================================================")

	// 1. Initialize Context, Dynamic Decoys, and Business Criticality
	criticalityPath := "config/criticality.yaml"
	if _, err := os.Stat(criticalityPath); os.IsNotExist(err) {
		criticalityPath = "../../config/criticality.yaml"
	}
	criticality := ctx.NewCriticalityEvaluator(criticalityPath)
	decoyMgr := ctx.NewDecoyManager()

	// Deploy dynamic decoy trap files in simulation watch folder
	watchDir := "./monitored_data"
	if err := decoyMgr.DeployDecoysInDir(watchDir); err != nil {
		log.Printf("[Main] Warning deploying decoys: %v", err)
	}

	// 2. Initialize Signal Queue & Responder
	signalQueue := engine.NewSignalQueue(10000)
	responder := engine.NewResponder()
	decisionEngine := engine.NewDecisionEngine(signalQueue, responder)
	decisionEngine.Start()

	// 3. Initialize Sensors
	fsSensor := sensors.NewFilesystemSensor(signalQueue, decoyMgr, criticality)
	procSensor := sensors.NewProcessSensor(signalQueue)
	netSensor := sensors.NewNetworkSensor(signalQueue)
	ioSensor := sensors.NewIORateSensor(signalQueue)

	// 4. Initialize eBPF Manager / Ringbuffer
	rawEventChan := make(chan ebpf.RawKernelEvent, 5000)
	bpfManager := ebpf.NewBPFManager(rawEventChan)
	if err := bpfManager.Start(); err != nil {
		log.Fatalf("[Main] Failed to start eBPF manager: %v", err)
	}

	// Consumer loop translating raw events to sensors
	ctxCancel, cancel := context.WithCancel(context.Background())
	go func() {
		for {
			select {
			case <-ctxCancel.Done():
				return
			case rawEvt, ok := <-rawEventChan:
				if !ok {
					return
				}
				switch rawEvt.Type {
				case ebpf.EventOpen, ebpf.EventWrite:
					fsSensor.ProcessEvent(rawEvt)
					if rawEvt.Type == ebpf.EventWrite {
						ioSensor.RecordWrite(rawEvt.PID, rawEvt.Comm)
					}
				case ebpf.EventExec:
					procSensor.ProcessEvent(rawEvt)
				case ebpf.EventConnect:
					netSensor.ProcessEvent(rawEvt)
				}
			}
		}
	}()

	// 5. Alert Forwarder to Server REST & SSE Endpoint
	go func() {
		serverURL := "http://localhost:8080/api/v1/alerts"
		for alert := range decisionEngine.AlertChan {
			alertJSON, _ := json.MarshalIndent(alert, "", "  ")
			fmt.Println("\n---------------- [ALERT DETECTED & CORRELATED] ----------------")
			fmt.Println(string(alertJSON))
			fmt.Println("----------------------------------------------------------------")

			// Forward alert to management server
			body, _ := json.Marshal(alert)
			req, err := http.NewRequest("POST", serverURL, bytes.NewBuffer(body))
			if err == nil {
				req.Header.Set("Content-Type", "application/json")
				client := &http.Client{Timeout: 2 * time.Second}
				resp, err := client.Do(req)
				if err == nil && resp != nil {
					resp.Body.Close()
				}
			}
		}
	}()

	log.Println("[Agent] KernelShield Ransomware Defense Agent actively monitoring.")

	// Graceful shutdown handler
	stopSignal := make(chan os.Signal, 1)
	signal.Notify(stopSignal, syscall.SIGINT, syscall.SIGTERM)
	<-stopSignal

	log.Println("[Agent] Shutting down KernelShield agent...")
	cancel()
	bpfManager.Stop()
	decisionEngine.Stop()
	log.Println("[Agent] Shutdown complete.")
}
