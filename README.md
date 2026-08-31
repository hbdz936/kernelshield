# KernelShield

**Proactive Linux Ransomware Defense Platform**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://web-theta-eight-18.vercel.app/)

KernelShield is an eBPF-based, signal-correlated security platform designed to detect and stop Linux ransomware in real time before file encryption occurs.

**Live Deployment (SOC Console)**: [https://web-theta-eight-18.vercel.app/](https://web-theta-eight-18.vercel.app/)

---

## The Problem

Linux servers host the core infrastructure of modern organizations, including databases, container hosts, and cloud storage. Ransomware targeting Linux systems operates at high speed, encrypting thousands of files per minute. 

By the time traditional security tools detect file modifications or alert security teams, critical business data is already compromised, resulting in costly downtime and data loss.

---

## The Gap

Existing Linux ransomware detection methods suffer from three main drawbacks:

1. **User-Space Latency**: Standard file-system monitors (like `inotify`) operate in user space. This introduces inspection delays, allowing rapid ransomware payloads to complete encryption before intervention.
2. **Static Honeypot Traps**: Traditional static honeypots are easily identified, ignored, or bypassed by modern ransomware binaries that scan file structures.
3. **High False Positive Rates**: Generic file activity monitors often flag legitimate high-volume operations (such as automated backups, batch processing, or database indexing) because they treat all directories equally.

---

## Our Solution

KernelShield bridges these gaps through a multi-sensor, kernel-level defense architecture:

- **Kernel-Level Speed via eBPF**: By attaching probes directly to kernel syscalls (`openat`, `write`, `execve`, `connect`), KernelShield inspects and evaluates process actions with zero-copy speed before changes persist to disk.
- **Dynamic Decoy Engine**: Automatically generates realistic, semantically matched honeypot trap files (such as `.docx`, `.xlsx`, `.pdf`) inside monitored paths. Any unauthorized process touching a decoy file triggers an immediate `SIGKILL` and network isolation.
- **Business Criticality Weighting**: Incorporates configurable directory weighting rules (e.g., higher priority for production databases and finance folders) into threat scoring to eliminate false positives on non-critical paths.
- **Multi-Sensor Threat Correlation**: Aggregates signals across file activity, process execution, network connections, and I/O rates within a sliding window per PID to calculate real-time threat scores.

---

## Key Features

- **Instant Zero-Trust Response**: Terminates malicious processes (`syscall.SIGKILL`) and isolates network links within milliseconds.
- **Context-Aware Decoys**: Dynamically generates realistic decoy files that mimic actual business documents.
- **Real-Time SOC Dashboard**: Provides live telemetry, process timelines, threat alert management, and response policy controls.

---

## Tech Stack & Architecture

- **Agent (Endpoint Monitoring)**: Built in Go 1.21+ using `cilium/ebpf` and `clang` compiled eBPF C probes (`openat.c`, `write.c`, `execve.c`, `connect.c`). Features a high-fidelity simulation mode for cross-platform development.
- **Server (Management Service)**: Built in Go 1.21+ with Gin REST API v1, gRPC telemetry ingestion, PostgreSQL / TimescaleDB storage, and Server-Sent Events (SSE) live alert engine.
- **Web UI (SOC Console)**: Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Recharts. Live demo hosted at [https://web-theta-eight-18.vercel.app/](https://web-theta-eight-18.vercel.app/).

---

## Repository Structure

```
kernelshield/
├── agent/             # Endpoint monitoring agent, eBPF probes, sensors, & decoy engine
├── server/            # Central management server, gRPC ingestion, REST API, & DB schema
├── web/               # Next.js 14 SOC dashboard
├── deploy/            # Docker Compose deployment setup
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

### 3. Start Endpoint Agent
```bash
make run-agent
```

### 4. Start Web Dashboard
```bash
make run-web
```
Open `http://localhost:3000` locally or access the live deployment at [https://web-theta-eight-18.vercel.app/](https://web-theta-eight-18.vercel.app/).
