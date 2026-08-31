package grpc

import (
	"context"
	"log"
)

// IngestionServer handles agent signal telemetry ingestion over gRPC
type IngestionServer struct{}

func NewIngestionServer() *IngestionServer {
	return &IngestionServer{}
}

// ReceiveSignal receives streaming signals from agents
func (s *IngestionServer) ReceiveSignal(ctx context.Context, signal interface{}) error {
	log.Println("[gRPC Ingestion] Telemetry signal ingested from agent.")
	return nil
}
