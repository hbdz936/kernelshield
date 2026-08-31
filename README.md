# KernelShield

**Proactive Linux Ransomware Defense Platform**

KernelShield is a signal-correlated, context-aware, eBPF-based security platform designed to detect and neutralize Linux ransomware threats before file encryption occurs.

---

## Overview

KernelShield combines low-level Linux kernel monitoring (via eBPF) with multi-sensor threat correlation to stop unauthorized file modification and ransomware behaviors in real time. It consists of an agent running on monitored endpoints, a central management server, and a web dashboard for security monitoring.

---

## Key Features

- **Dynamic Decoy Traps**: Generates realistic honeypot files (`.docx`, `.xlsx`, `.pdf`) in monitored directory paths. Any unauthorized process interacting with these decoy files is immediately neutralized via `SIGKILL` and network isolation.
- **Business Criticality Weighting**: Evaluates threat severity based on path criticality configuration (e.g., higher priority for production data vs. temporary directories) to minimize false positives.
- **Multi-Sensor Signal Correlation**: Collects events across file access, process execution, network activity, and I/O rates. Threat scoring correlates these signals within a sliding window per process (PID).
- **Real-Time SOC Console**: Next.js dashboard providing live alerts, process timelines, endpoint status, and response modes.

---

## Tech Stack & Architecture

- **Agent (Endpoint Monitoring)**: Go 1.21+, `cilium/ebpf`, `clang` compiled eBPF C programs (`openat.c`, `write.c`, `execve.c`, `connect.c`). Includes simulation mode for non-Linux/development environments.
- **Server (Central Management)**: Go 1.21+, Gin REST API v1, gRPC telemetry ingestion, PostgreSQL / TimescaleDB, Server-Sent Events (SSE) live alert stream.
- **Web UI (Security Dashboard)**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts.

---

## Repository Structure

```
kernelshield/
├── agent/             # Go agent & eBPF C probes (sensors, correlator, decoys)
├── server/            # Go management server (REST API, gRPC ingestion, DB)
├── web/               # Next.js 14 SOC dashboard
├── deploy/            # Docker Compose setup
├── Makefile           # Unified build & run automation
└── README.md          # Project documentation
```

---

## Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+ and npm
- Docker (optional, for TimescaleDB)

### 1. Build All Components
```bash
make build
```

### 2. Start Management Server
```bash
make run-server
```

### 3. Start Agent
```bash
make run-agent
```

### 4. Start Web Dashboard
```bash
make run-web
```
Open `http://localhost:3000` in your browser to access the security management console.
