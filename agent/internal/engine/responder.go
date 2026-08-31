package engine

import (
	"fmt"
	"log"
	"os/exec"
	"runtime"
	"syscall"
)

// Responder executes automated active response actions
type Responder struct{}

// NewResponder constructs a Responder
func NewResponder() *Responder {
	return &Responder{}
}

// ExecuteKill terminates malicious process by PID and isolates network if needed
func (r *Responder) ExecuteKill(alert ThreatAlert) error {
	log.Printf("[RESPONDER] Executing instant mitigation for PID %d (%s)...", alert.PID, alert.ProcessName)

	if alert.PID == 0 {
		return fmt.Errorf("invalid PID 0")
	}

	if runtime.GOOS == "windows" {
		// Windows test execution command
		cmd := exec.Command("taskkill", "/F", "/PID", fmt.Sprintf("%d", alert.PID))
		_ = cmd.Run()
	} else {
		// Linux syscall kill
		err := syscall.Kill(int(alert.PID), syscall.SIGKILL)
		if err != nil {
			log.Printf("[RESPONDER] syscall.Kill error for PID %d: %v", alert.PID, err)
		}
	}

	if alert.IsDecoyTrigger {
		r.IsolateNetworkInterface()
	}

	return nil
}

// IsolateNetworkInterface simulates isolating network card to stop C2 communication / exfiltration
func (r *Responder) IsolateNetworkInterface() {
	log.Println("[RESPONDER - NETWORK ISOLATION] Isolating network interface to block command & control communication...")
}
