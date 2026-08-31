package sensors

import (
	"math"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/yourcompany/kernelshield/agent/internal/context"
	"github.com/yourcompany/kernelshield/agent/internal/ebpf"
	"github.com/yourcompany/kernelshield/agent/internal/engine"
)

// FilesystemSensor processes raw kernel file events and calculates Shannon Entropy
type FilesystemSensor struct {
	queue       *engine.SignalQueue
	decoyMgr    *context.DecoyManager
	criticality *context.CriticalityEvaluator
}

// NewFilesystemSensor initializes the filesystem sensor
func NewFilesystemSensor(q *engine.SignalQueue, dm *context.DecoyManager, ce *context.CriticalityEvaluator) *FilesystemSensor {
	return &FilesystemSensor{
		queue:       q,
		decoyMgr:    dm,
		criticality: ce,
	}
}

// ProcessEvent analyzes a raw kernel event and pushes a Signal to the queue
func (fs *FilesystemSensor) ProcessEvent(event ebpf.RawKernelEvent) {
	if event.Path == "" {
		return
	}

	isDecoy := fs.decoyMgr.IsDecoy(event.Path)
	weight := fs.criticality.GetWeight(event.Path)
	
	entropy := 0.0
	if event.Type == ebpf.EventWrite {
		entropy = fs.calculateFileEntropy(event.Path)
	}

	sigType := engine.SignalFile
	if isDecoy {
		sigType = engine.SignalDecoy
	}

	sig := engine.Signal{
		ID:                uuid.New().String(),
		PID:               event.PID,
		PPID:              event.PPID,
		ProcessName:       event.Comm,
		Path:              event.Path,
		Type:              sigType,
		EntropyConfidence: entropy,
		IOConfidence:      0.5,
		IsDecoy:           isDecoy,
		CriticalityWeight: weight,
		Timestamp:         event.Timestamp,
	}

	if sig.Timestamp.IsZero() {
		sig.Timestamp = time.Now()
	}

	fs.queue.Push(sig)
}

// calculateFileEntropy computes Shannon Entropy (0.0 to 1.0 normalized) for a sample of file bytes
func (fs *FilesystemSensor) calculateFileEntropy(filePath string) float64 {
	file, err := os.Open(filePath)
	if err != nil {
		return 0.5 // Default baseline estimate if file unreadable
	}
	defer file.Close()

	buf := make([]byte, 4096)
	n, err := file.Read(buf)
	if err != nil || n == 0 {
		return 0.5
	}

	freq := make(map[byte]int)
	for i := 0; i < n; i++ {
		freq[buf[i]]++
	}

	var entropy float64
	for _, count := range freq {
		p := float64(count) / float64(n)
		entropy -= p * math.Log2(p)
	}

	// Max Shannon entropy for bytes (256 symbols) is 8.0 bits per byte.
	normalized := entropy / 8.0
	return normalized
}
