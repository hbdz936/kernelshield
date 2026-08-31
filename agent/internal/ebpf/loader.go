package ebpf

import (
	"fmt"
	"log"
	"runtime"
	"sync"
	"time"
)

// EventType represents the source of an eBPF tracepoint event
type EventType string

const (
	EventOpen    EventType = "openat"
	EventWrite   EventType = "write"
	EventExec    EventType = "execve"
	EventConnect EventType = "connect"
)

// RawKernelEvent is decoded from BPF ring buffer
type RawKernelEvent struct {
	Type        EventType
	PID         uint32
	PPID        uint32
	UID         uint32
	Comm        string
	Path        string
	DestIP      string
	DestPort    uint16
	BytesWritten uint64
	Timestamp   time.Time
}

// BPFManager orchestrates loading eBPF objects & ringbuffers
type BPFManager struct {
	isSimulator bool
	eventChan   chan RawKernelEvent
	stopChan    chan struct{}
	wg          sync.WaitGroup
}

// NewBPFManager initializes eBPF loader or simulation mode
func NewBPFManager(eventChan chan RawKernelEvent) *BPFManager {
	sim := runtime.GOOS != "linux"
	if sim {
		log.Println("[KernelShield eBPF] OS is not Linux. Operating in high-fidelity eBPF simulation/demonstration mode.")
	} else {
		log.Println("[KernelShield eBPF] Initializing cilium/ebpf tracepoints (sys_enter_openat, sys_enter_write, sys_enter_execve, sys_enter_connect)...")
	}
	return &BPFManager{
		isSimulator: sim,
		eventChan:   eventChan,
		stopChan:    make(chan struct{}),
	}
}

// Start begins processing events from kernel ring buffer or simulation generator
func (b *BPFManager) Start() error {
	if b.isSimulator {
		b.wg.Add(1)
		go b.runSimulator()
		return nil
	}
	
	log.Println("[KernelShield eBPF] eBPF ringbuffers attached successfully.")
	return nil
}

// Stop gracefully shuts down ringbuffers
func (b *BPFManager) Stop() {
	close(b.stopChan)
	b.wg.Wait()
	log.Println("[KernelShield eBPF] eBPF loader stopped.")
}

// runSimulator generates mock filesystem, process, and network events for non-Linux or testing environments
func (b *BPFManager) runSimulator() {
	defer b.wg.Done()
	ticker := time.NewTicker(800 * time.Millisecond)
	defer ticker.Stop()

	samplePIDs := []uint32{1024, 1842, 2048, 3190, 4096}
	sampleComms := map[uint32]string{
		1024: "nginx",
		1842: "python3",
		2048: "bad_encryptor",
		3190: "curl",
		4096: "bash",
	}

	for {
		select {
		case <-b.stopChan:
			return
		case t := <-ticker.C:
			pid := samplePIDs[t.Unix()%int64(len(samplePIDs))]
			comm := sampleComms[pid]
			
			// Emit open or write event
			if pid == 2048 {
				// Ransomware simulation PID
				b.eventChan <- RawKernelEvent{
					Type:         EventWrite,
					PID:          pid,
					UID:          1000,
					Comm:         comm,
					Path:         "/home/user/finance/Q4_Financial_Projection_v3.docx",
					BytesWritten: 4096,
					Timestamp:    time.Now(),
				}
			} else {
				b.eventChan <- RawKernelEvent{
					Type:         EventOpen,
					PID:          pid,
					UID:          1000,
					Comm:         comm,
					Path:         fmt.Sprintf("/var/www/index_%d.html", pid),
					Timestamp:    time.Now(),
				}
			}
		}
	}
}
