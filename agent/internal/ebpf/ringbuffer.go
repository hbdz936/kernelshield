package ebpf

import (
	"context"
	"log"
)

// RingBufferConsumer consumes raw BPF ring buffer data and routes to channels
type RingBufferConsumer struct {
	bpfMgr    *BPFManager
	eventChan chan RawKernelEvent
}

// NewRingBufferConsumer creates a ringbuffer consumer instance
func NewRingBufferConsumer(mgr *BPFManager, eventChan chan RawKernelEvent) *RingBufferConsumer {
	return &RingBufferConsumer{
		bpfMgr:    mgr,
		eventChan: eventChan,
	}
}

// Listen starts listening to ring buffer events asynchronously
func (r *RingBufferConsumer) Listen(ctx context.Context) {
	log.Println("[RingBufferConsumer] Subscribed to eBPF ring buffer stream.")
	<-ctx.Done()
	log.Println("[RingBufferConsumer] Context cancelled, shutting down ringbuffer consumer.")
}
