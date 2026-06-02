# 🐸 FrogUI — The Visual Web GUI for Autonomous AI Agents

<p align="center">
  <strong>A premium, self-hosted Web UI alternative for terminal-based AI agents (e.g., Hermes Agent, OpenClaw, and emerging tools).</strong><br>
  Terminal Subprocess Manager • Rust API Gateway • Real-time Web UI
</p>

---

## 📋 Table of Contents

- [Why FrogUI?](#why-frogui)
- [Overview & Capabilities](#overview--capabilities)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [VPS Deployment Guide](#vps-deployment-guide)
- [API Reference](#api-reference)
- [License](#license)

---

## Why FrogUI? 

Autonomous AI agent frameworks (like **Hermes Agent**, **OpenClaw**, and many other emerging tools) are incredibly powerful, but they often restrict you to a terminal (CLI) interface or require integration with third-party chat apps (Telegram, Discord, Slack) to interact visually.

**FrogUI bridges that gap.** 

As the ecosystem of CLI-based autonomous agents continues to grow, FrogUI provides a generalized, **rich, interactive, and professional Web GUI** layer. This project is continuously being updated and supported to adapt to new agent frameworks as they emerge.

If you are a developer, researcher, or AI enthusiast who wants to experiment with autonomous agent workflows but prefers a visual experience over scrolling text in a black terminal, FrogUI is built for you.

FrogUI provides:
- 🖥️ **Visual Command Panel:** Send complex tasks and view agent reasoning streams in real-time.
- 🧠 **Memory Visualization:** See what your agent remembers from past sessions.
- 📊 **Status Indicators:** Visually track the execution state of your agent's background tasks.
- 🔒 **Self-Hosted Privacy:** Keep your data completely private, just like OpenClaw.

---

## Overview & Capabilities

FrogUI acts as a Terminal Subprocess Manager and Web UI. Instead of running heavy AI inference engines itself, it wraps around your favorite CLI agents, executes them in the background, and streams their terminal output straight to a beautiful web dashboard.

**Core Capabilities:**
- 🦀 **Rust API Gateway & Process Manager:** Spawns your CLI agent processes locally and streams `stdout`/`stderr` securely via Server-Sent Events (SSE).
- 🗄️ **Persistent Agent Memory:** Uses PostgreSQL with `pgvector` to store and semantically retrieve past agent interactions and skills.
- ⚡ **Real-time Task State:** Uses Redis to manage and track the state of long-running autonomous tasks.
- 🎨 **Minimalist Luxury UI:** A framework-agnostic Web Components UI (with React adapter) that feels premium and responsive.

---

## Architecture

FrogUI separates the UI and the API gateway for maximum performance and stability.

```
┌─────────────────────────────────────────────────────────┐
│                      User Browser                       │
│          FrogUI Web Components / React Adapter          │
│        (The Visual Alternative to CLI Terminals)        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / Real-time SSE Stream
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Rust API Gateway (:3001)                  │
│   Auth • Rate Limit • Subprocess Manager • Streaming    │
└──────┬─────────────────┬──────────────────┬─────────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌─────────────┐  ┌───────────────┐
│  CLI Agent   │  │  PostgreSQL │  │     Redis     │
│  (e.g.,      │  │  + pgvector │  │    (:6379)    │
│  OpenClaw)   │  │   (:5432)   │  │  Task State   │
└──────────────┘  └─────────────┘  └───────────────┘
```

---

## Prerequisites

To run FrogUI locally or on a server, you need:

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 20.10+ | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2+ | Multi-container orchestration |
| [Git](https://git-scm.com/) | 2.30+ | Version control |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Firdan19/FrogUI.git
cd FrogUI
```

### 2. Set up your environment

```bash
cp .env.example .env
```
> ⚠️ **Important:** If deploying to a public server, change the `POSTGRES_PASSWORD` and `DATABASE_URL` in your `.env` file!
By default, `AGENT_CLI_COMMAND` is set to a mock script (`./scripts/run_agent.sh`). You can change this to the command that runs your actual CLI agent.

### 3. Launch the Ecosystem

```bash
docker compose up --build
```

### 4. Access the Visual GUI

Open your browser and navigate to:
- 🎨 **Studio UI (Visual Interface):** [http://localhost:5173](http://localhost:5173)

Behind the scenes:
- 🦀 **API Gateway:** `localhost:3001`
- 🗄️ **PostgreSQL Memory DB:** `localhost:5432`
- ⚡ **Redis State:** `localhost:6379`

---

## Project Structure

```
FrogUI/
├── apps/
│   ├── api-gateway/          # Rust API gateway & Subprocess runner
│   ├── studio/               # The Visual GUI shell
│   └── frontend/             # Demo UI
├── packages/
│   ├── ui-core/              # Vanilla Web Components (The GUI layer)
│   ├── react-adapter/        # React wrappers & hooks
│   └── shared-contracts/     # JSON schemas & API types
├── database/
│   ├── postgres/init/        # SQL migrations (pgvector memory tables)
│   └── redis/                # Redis config
├── infra/                    # Dockerfiles, Security, Observability
├── scripts/                  # Utilities (e.g. mock agent scripts)
└── docker-compose.yml        # Full stack orchestration
```

---

## Configuration

Customize your deployment by editing `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `FROGUI_ENV` | `development` | Environment mode |
| `GATEWAY_PORT` | `3001` | API Gateway port |
| `AGENT_CLI_COMMAND` | `./scripts/run_agent.sh` | The terminal command executed by the Gateway |
| `POSTGRES_PASSWORD` | *(see .env)* | **Change this for production!** |
| `DATABASE_URL` | *(auto-composed)* | Full PostgreSQL connection string |
| `STUDIO_PORT` | `5173` | Studio UI port |

---

## VPS Deployment Guide

If you want to host your agent on a cloud server (VPS) so it runs 24/7 autonomously, follow these steps:

### 1. VPS Preparation
Get a fresh Ubuntu server (e.g., Oracle Cloud Free Tier, Hetzner, or DigitalOcean).
```bash
sudo apt update && sudo apt upgrade -y
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin -y
# Log out and log back in to apply group changes
```

### 2. Clone & Configure
```bash
git clone https://github.com/Firdan19/FrogUI.git
cd FrogUI
cp .env.example .env
nano .env
```
*Change `FROGUI_ENV=production`, set your actual `AGENT_CLI_COMMAND`, and set a secure `POSTGRES_PASSWORD`.*

### 3. Launch
```bash
docker compose up --build -d
```

### 4. Reverse Proxy (Optional but Recommended)
To access your agent securely via HTTPS, install Nginx and Certbot:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```
Create a proxy configuration routing port `80/443` to `127.0.0.1:5173` (Studio UI) and `/api` to `127.0.0.1:3001` (Gateway). Run `sudo certbot --nginx` to secure it.

---

## API Reference

If you still want to interact with your agent programmatically, you can use the Rust API Gateway:

### Start a Task (Command)
```http
POST /api/command
Content-Type: application/json

{
  "command": "Analyze the latest logs and summarize errors."
}
```

### Stream Agent Terminal Output (SSE)
```http
GET /api/events
Accept: text/event-stream
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
