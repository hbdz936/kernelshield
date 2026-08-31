# KernelShield Master Unified Makefile

.PHONY: all agent server web run build test clean help

all: build

agent:
	@echo "==> Building KernelShield Agent..."
	@cd agent && go build -o ../bin/agent ./cmd/agent

server:
	@echo "==> Building KernelShield Server..."
	@cd server && go build -o ../bin/server ./cmd/server

web:
	@echo "==> Installing & building Web UI..."
	@cd web && npm install && npm run build

build: agent server web
	@echo "==> Build complete for Agent, Server, and Web UI."

run-server:
	@echo "==> Starting KernelShield REST & gRPC Management Server..."
	@cd server && go run ./cmd/server/main.go

run-agent:
	@echo "==> Starting KernelShield eBPF Agent..."
	@cd agent && go run ./cmd/agent/main.go

run-web:
	@echo "==> Starting Next.js Web UI Console..."
	@cd web && npm run dev

run:
	@echo "=========================================================="
	@echo "       KERNELSHIELD ALL-IN-ONE LOCAL RUN COMMAND          "
	@echo "=========================================================="
	@echo "1. Run server in window 1:  make run-server"
	@echo "2. Run agent in window 2:   make run-agent"
	@echo "3. Run web UI in window 3:  make run-web"

clean:
	@rm -rf bin/
	@echo "==> Cleaned build binaries."
