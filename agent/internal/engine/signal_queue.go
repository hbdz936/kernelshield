package engine

import (
	"sync"
	"time"
)

// SignalType categorizes the sensor emitting the telemetry
type SignalType string

const (
	SignalFile    SignalType = "FILE_OP"
	SignalProcess SignalType = "PROCESS_EXEC"
	SignalNetwork SignalType = "NET_CONNECT"
	SignalIORate  SignalType = "IO_RATE_BURST"
	SignalDecoy   SignalType = "DECOY_TRIGGER"
)

// Signal represents a single telemetry event captured from kernel or sensors
type Signal struct {
	ID                 string                 `json:"id"`
	PID                uint32                 `json:"pid"`
	PPID               uint32                 `json:"ppid"`
	ProcessName        string                 `json:"process_name"`
	Path               string                 `json:"path"`
	Type               SignalType             `json:"type"`
	EntropyConfidence  float64                `json:"entropy_confidence"`
	IOConfidence       float64                `json:"io_confidence"`
	IsDecoy            bool                   `json:"is_decoy"`
	CriticalityWeight  float64                `json:"criticality_weight"`
	DestIP             string                 `json:"dest_ip,omitempty"`
	DestPort           uint16                 `json:"dest_port,omitempty"`
	Timestamp          time.Time              `json:"timestamp"`
	Metadata           map[string]interface{} `json:"metadata,omitempty"`
}

// SignalQueue is a high-performance thread-safe channel for sensor signals
type SignalQueue struct {
	queue chan Signal
	mu    sync.RWMutex
}

// NewSignalQueue constructs a SignalQueue with specified capacity
func NewSignalQueue(capacity int) *SignalQueue {
	return &SignalQueue{
		queue: make(chan Signal, capacity),
	}
}

// Push adds a signal to the queue without blocking if full
func (sq *SignalQueue) Push(sig Signal) bool {
	select {
	case sq.queue <- sig:
		return true
	default:
		// Queue full, drop signal or log overflow
		return false
	}
}

// Channel returns the receive-only channel
func (sq *SignalQueue) Channel() <-chan Signal {
	return sq.queue
}
