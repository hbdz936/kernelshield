package sensors

import (
	"time"

	"github.com/google/uuid"
	"github.com/yourcompany/kernelshield/agent/internal/ebpf"
	"github.com/yourcompany/kernelshield/agent/internal/engine"
)

// NetworkSensor captures outbound connection attempts
type NetworkSensor struct {
	queue *engine.SignalQueue
}

// NewNetworkSensor constructs a NetworkSensor
func NewNetworkSensor(q *engine.SignalQueue) *NetworkSensor {
	return &NetworkSensor{queue: q}
}

// ProcessEvent emits NetSignal
func (ns *NetworkSensor) ProcessEvent(event ebpf.RawKernelEvent) {
	sig := engine.Signal{
		ID:                uuid.New().String(),
		PID:               event.PID,
		ProcessName:       event.Comm,
		Type:              engine.SignalNetwork,
		EntropyConfidence: 0.0,
		IOConfidence:      0.4,
		DestIP:            event.DestIP,
		DestPort:          event.DestPort,
		Timestamp:         event.Timestamp,
	}

	if sig.Timestamp.IsZero() {
		sig.Timestamp = time.Now()
	}

	ns.queue.Push(sig)
}
