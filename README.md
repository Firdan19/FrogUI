# 🐸 FrogUI — The Visual Web GUI for Autonomous AI Agents

<p align="center">
  <strong>A premium, self-hosted Web UI alternative for users of terminal-based agents like Hermes Agent and OpenClaw.</strong><br>
  High-performance C++ inference engine • Rust API Gateway • Real-time Web UI
</p>

---

## 📋 Table of Contents

- [Why FrogUI? (The Hermes & OpenClaw Alternative)](#why-frogui)
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

Autonomous AI agent frameworks like **Hermes Agent** and **OpenClaw** are incredibly powerful, but they often restrict you to a terminal (CLI) interface or require integration with third-party chat apps (Telegram, Discord, Slack) to interact visually.

**FrogUI bridges that gap.** 

If you are a developer, researcher, or AI enthusiast who wants to experiment with autonomous agent workflows but prefers a **rich, interactive, and professional Web GUI**, FrogUI is built for you. 

Instead of staring at scrolling text in a black terminal, FrogUI provides:
- 🖥️ **Visual Command Panel:** Send complex tasks and view agent reasoning streams in real-time.
- 🧠 **Memory Visualization:** See what your agent remembers from past sessions.
- 📊 **Status Indicators:** Visually track the execution state of your agent's background tasks.
- 🔒 **Self-Hosted Privacy:** Keep your data completely private, just like OpenClaw.

---

## Overview & Capabilities

FrogUI is a full-stack, self-hosted agent framework. It provides its own internal C++ runtime powered by `llama.cpp` to execute tasks and reasoning locally, bypassing the need for expensive API subscriptions.

**Core Capabilities:**
- 🧠 **Local C++ Core Engine:** Executes GGUF models (like TinyLlama) locally for fast, private inference.
- 🦀 **Rust API Gateway:** Handles secure request mediation, rate limiting, and real-time Server-Sent Events (SSE).
- 🗄️ **Persistent Agent Memory:** Uses PostgreSQL with `pgvector` to store and semantically retrieve past agent interactions and skills.
- ⚡ **Real-time Task State:** Uses Redis to manage and track the state of long-running autonomous tasks.
- 🎨 **Minimalist Luxury UI:** A framework-agnostic Web Components UI (with React adapter) that feels premium and responsive.

---

## Architecture

FrogUI separates the UI, the API gateway, and the heavy inference engine into dedicated microservices for maximum performance and stability.

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
│   Auth • Rate Limit • Audit Log • Event Streaming       │
└──────┬─────────────────┬──────────────────┬─────────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌─────────────┐  ┌───────────────┐
│  C++ Engine  │  │  PostgreSQL │  │     Redis     │
│   (:8080)    │  │  + pgvector │  │    (:6379)    │
│  llama.cpp   │  │   (:5432)   │  │  Task State   │
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

*(If you wish to compile the C++ Engine or Rust Gateway manually without Docker, you will need CMake 3.20+ and Rust 1.75+).*

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

### 3. Download the AI model

The C++ Core Engine requires a GGUF model to function autonomously. Download the default test model (TinyLlama ~637 MB):

```bash
bash scripts/download_model.sh
```

### 4. Launch the Agent Ecosystem

```bash
docker compose up --build
```

### 5. Access the Visual GUI

Open your browser and navigate to:
- 🎨 **Studio UI (Visual Interface):** [http://localhost:5173](http://localhost:5173)

Behind the scenes:
- 🦀 **API Gateway:** `localhost:3001`
- 🗄️ **PostgreSQL Memory DB:** `localhost:5432`
- ⚡ **Redis State:** `localhost:6379`
- 🧠 **C++ Core Engine:** Runs privately on the internal Docker network (`:8080`).

---

## Project Structure

```
FrogUI/
├── apps/
│   ├── core-engine/          # C++ Autonomous Agent Engine (llama.cpp)
│   ├── api-gateway/          # Rust API gateway & SSE event stream
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
├── scripts/                  # Utilities for model download & db reset
└── docker-compose.yml        # Full stack orchestration
```

---

## Configuration

Customize your deployment by editing `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `FROGUI_ENV` | `development` | Environment mode |
| `GATEWAY_PORT` | `3001` | API Gateway port |
| `CORE_ENGINE_URL` | `http://core-engine:8080` | Internal C++ engine URL |
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
*Change `FROGUI_ENV=production` and set a secure `POSTGRES_PASSWORD`.*

### 3. Launch
```bash
bash scripts/download_model.sh
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

If you still want to interact with your agent programmatically (like OpenClaw), you can use the Rust API Gateway:

### Start a Task (Command)
```http
POST /api/command
Content-Type: application/json

{
  "command": "Analyze the latest logs and summarize errors."
}
```

### Stream Agent Reasoning (SSE)
```http
GET /api/events
Accept: text/event-stream
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
