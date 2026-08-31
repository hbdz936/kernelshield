package sensors

import (
	"time"

	"github.com/google/uuid"
	"github.com/yourcompany/kernelshield/agent/internal/ebpf"
	"github.com/yourcompany/kernelshield/agent/internal/engine"
)

// ProcessSensor captures process execve events
type ProcessSensor struct {
	queue *engine.SignalQueue
}

// NewProcessSensor constructs a ProcessSensor
func NewProcessSensor(q *engine.SignalQueue) *ProcessSensor {
	return &ProcessSensor{queue: q}
}

// ProcessEvent turns execve event into a ProcessSignal
func (ps *ProcessSensor) ProcessEvent(event ebpf.RawKernelEvent) {
	sig := engine.Signal{
		ID:                uuid.New().String(),
		PID:               event.PID,
		PPID:              event.PPID,
		ProcessName:       event.Comm,
		Path:              event.Path,
		Type:              engine.SignalProcess,
		EntropyConfidence: 0.1,
		IOConfidence:      0.2,
		CriticalityWeight: 1.0,
		Timestamp:         event.Timestamp,
	}

	if sig.Timestamp.IsZero() {
		sig.Timestamp = time.Now()
	}

	ps.queue.Push(sig)
}
