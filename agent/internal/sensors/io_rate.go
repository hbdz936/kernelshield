package sensors

import (
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/yourcompany/kernelshield/agent/internal/engine"
)

// IORateSensor monitors I/O bursts and write operations per PID
type IORateSensor struct {
	queue      *engine.SignalQueue
	pidWriteCnt map[uint32]int
	mu         sync.Mutex
}

// NewIORateSensor constructs IORateSensor
func NewIORateSensor(q *engine.SignalQueue) *IORateSensor {
	sensor := &IORateSensor{
		queue:      q,
		pidWriteCnt: make(map[uint32]int),
	}
	go sensor.startMonitor()
	return sensor
}

// RecordWrite increments write count for a PID
func (io *IORateSensor) RecordWrite(pid uint32, comm string) {
	io.mu.Lock()
	defer io.mu.Unlock()

	io.pidWriteCnt[pid]++
	count := io.pidWriteCnt[pid]

	// High write rate burst threshold (>30 file writes per second)
	if count > 30 {
		sig := engine.Signal{
			ID:                uuid.New().String(),
			PID:               pid,
			ProcessName:       comm,
			Type:              engine.SignalIORate,
			EntropyConfidence: 0.8,
			IOConfidence:      0.95,
			Timestamp:         time.Now(),
		}
		io.queue.Push(sig)
	}
}

// startMonitor resets write counts every 1 second window
func (io *IORateSensor) startMonitor() {
	ticker := time.NewTicker(1 * time.Second)
	for range ticker.C {
		io.mu.Lock()
		io.pidWriteCnt = make(map[uint32]int)
		io.mu.Unlock()
	}
}
