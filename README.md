# KernelShield - Proactive Linux Ransomware Defense Platform

[![Go 1.21+](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://golang.org)
[![eBPF](https://img.shields.io/badge/eBPF-cilium%2Febpf-orange?style=flat&logo=linux)](https://ebpf.io)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-TimescaleDB-336791?style=flat&logo=postgresql)](https://timescale.com)

> **"One Kernel, Four Sensors, One Brain."**  
> KernelShield is a signal-correlated, context-aware, eBPF-based prevention system designed to detect and neutralize Linux ransomware at zero-copy speed before encryption begins.

---

## 🚀 Key Differentiators (USPs)

### 1. Dynamic Decoys (USP #1 - Instant Kill Traps)
Traditional static honeypots are static and easily bypassed. KernelShield automatically scans monitored file paths, identifies real document extensions (`.docx`, `.xlsx`, `.pdf`), and uses a template engine to generate semantically realistic decoy trap files (e.g., `Q4_Financial_Projection_v3.docx`). Any `write` or `openat` syscall touching a trap path triggers an **Instant Kill (`syscall.SIGKILL`) and Network Link Isolation**.

### 2. Business Criticality Weighting (USP #2 - False Positive Elimination)
Not all files carry equal risk. KernelShield loads `config/criticality.yaml` rules to assign path weights (e.g., `/home/*/finance` = 10x, `/var/www` = 7x, `/tmp` = 1x). Threat scoring uses:
$$\text{ThreatScore} = (\text{Entropy\_Confidence} \times \text{Criticality\_Weight} \times 7.5) + (\text{IO\_Confidence} \times 25.0)$$

### 3. Signal Queue & Sliding Window Correlator (USP #3 - Multi-Sensor Correlation)
Sensors stream `Signal` structs (`FILE_OP`, `PROCESS_EXEC`, `NET_CONNECT`, `IO_RATE_BURST`) into a thread-safe channel queue. The Decision Engine groups signals by **PID** inside a **5-second sliding window** to calculate aggregate threat scores.

---

## 🛠️ Tech Stack & Architecture

- **Agent (Endpoint Side):** Go 1.21+, `cilium/ebpf`, `clang` compiled eBPF C programs (`openat.c`, `write.c`, `execve.c`, `connect.c`), Viper. High-fidelity eBPF simulation mode enabled for cross-platform/non-root development.
- **Server (Management Console):** Go 1.21+, Gin REST API v1, gRPC Telemetry Ingestion, PostgreSQL + TimescaleDB extension, SSE (Server-Sent Events) live alert engine.
- **Web UI (SOC Dashboard):** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts dynamic visuals, Lucide icons, SSE real-time stream.

---

## 📁 Repository Structure

```
kernelshield/
├── agent/
│   ├── cmd/agent/main.go            # Agent entrypoint
│   ├── internal/
│   │   ├── ebpf/                    # C probes (openat, write, execve, connect) & cilium/ebpf loader
│   │   ├── sensors/                 # File, Process, Network, and I/O Rate sensors
│   │   ├── context/                 # Dynamic Decoy Manager & Business Criticality Evaluator
│   │   ├── engine/                  # Signal Queue, Correlator Decision Engine & Responder
│   │   └── storage/                 # TTL Memory Cache
│   ├── config/                      # agent.yaml & criticality.yaml
│   └── go.mod
├── server/
│   ├── cmd/server/main.go          # Server entrypoint
│   ├── internal/
│   │   ├── api/
│   │   │   ├── grpc/                # gRPC ingestion & agent management
│   │   │   └── rest/v1/             # Gin REST endpoints & SSE Alert Broadcaster
│   │   ├── db/                      # GORM PostgreSQL & TimescaleDB driver
│   │   └── notifier/                # Webhook & Email alert notification dispatchers
│   ├── migrations/                  # 001_init.sql PostgreSQL schema
│   └── go.mod
├── web/                             # Next.js 14 App Router SOC Console
├── deploy/                          # Docker Compose configuration
├── Makefile                         # Unified build file
└── README.md
```

---

## 🏁 Quick Start & Build Instructions

### Prerequisites
- Go 1.21+
- Node.js 18+ & npm
- Docker (optional for TimescaleDB)

### 1. Build Binaries
```bash
make build
```

### 2. Run Management Server (Port 8080 REST / 50051 gRPC)
```bash
make run-server
```

### 3. Run Ransomware Defense Agent (Simulated / eBPF)
```bash
make run-agent
```

### 4. Run Next.js SOC Dashboard (Port 3000)
```bash
make run-web
```
Open **`http://localhost:3000`** in your browser to inspect real-time alerts, dynamic decoy triggers, and endpoint metrics!
