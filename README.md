# 🐸 FrogUI — AI Agent Framework

<p align="center">
  <strong>Enterprise-grade AI agent framework with a luxury minimal UI.</strong><br>
  High-performance C++ inference engine • Rust API Gateway • Real-time Web UI
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Deployment to VPS](#deployment-to-vps)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

FrogUI is a **self-hosted AI agent framework** that separates a high-performance backend runtime from a plug-and-play UI layer. Designed for single-user, professional use.

**Key Features:**
- 🧠 **C++ Core Engine** — Local AI inference via llama.cpp (GGUF models)
- 🦀 **Rust API Gateway** — Secure request mediation with rate limiting, audit logging, and SSE streaming
- 🗄️ **PostgreSQL + pgvector** — Vector-based agent memory for semantic recall
- ⚡ **Redis** — Real-time task state management
- 🎨 **Web Components UI** — Framework-agnostic components with React adapter

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      User Browser                       │
│          FrogUI Web Components / React Adapter           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / SSE
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Rust API Gateway (:3001)                  │
│   Auth • Rate Limit • Audit Log • SSE Stream            │
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

Make sure these tools are installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 20.10+ | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2+ | Multi-container orchestration |
| [Git](https://git-scm.com/) | 2.30+ | Version control |

**Optional** (for local development without Docker):

| Tool | Version | Purpose |
|------|---------|---------|
| [Rust](https://rustup.rs/) | 1.75+ | Build API Gateway |
| [CMake](https://cmake.org/) | 3.20+ | Build C++ Core Engine |
| [Node.js](https://nodejs.org/) | 20+ | Build UI packages |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Database with pgvector |
| [Redis](https://redis.io/) | 7+ | State management |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Firdan19/FrogUI.git
cd FrogUI
```

### 2. Copy environment file

```bash
cp .env.example .env
```

> ⚠️ **Important:** Edit `.env` and change `POSTGRES_PASSWORD` before deploying to production!

### 3. Download AI model

```bash
bash scripts/download_model.sh
```

This downloads **TinyLlama 1.1B** (~637 MB) to `apps/core-engine/models/`.

### 4. Start all services

```bash
docker compose up --build
```

### 5. Open in browser

| Service | URL |
|---------|-----|
| 🎨 Studio UI | [http://localhost:5173](http://localhost:5173) |
| 🦀 API Gateway | [http://localhost:3001](http://localhost:3001) |
| 🗄️ PostgreSQL | `localhost:5432` |
| ⚡ Redis | `localhost:6379` |

The C++ Core Engine runs on internal Docker network only (port `8080`).

---

## Project Structure

```
FrogUI/
├── apps/
│   ├── core-engine/          # C++ AI inference engine (llama.cpp)
│   │   ├── include/frogui/   # Header files
│   │   ├── src/              # Source files
│   │   ├── models/           # GGUF model files (git-ignored)
│   │   ├── protocols/        # JSON schemas for agent communication
│   │   ├── tests/            # Unit tests (Catch2)
│   │   └── CMakeLists.txt    # Build configuration
│   ├── api-gateway/          # Rust Actix-Web API gateway
│   │   ├── src/
│   │   │   ├── middleware/   # Auth, rate limit, request guard
│   │   │   ├── models/      # Data models
│   │   │   ├── routes/      # HTTP endpoints (command, SSE, health)
│   │   │   └── services/    # Business logic (DB, Redis, streaming)
│   │   ├── Cargo.toml
│   │   └── Cargo.lock
│   ├── studio/               # Single-user UI shell
│   └── frontend/             # Landing page / demo UI
├── packages/
│   ├── ui-core/              # Vanilla Web Components
│   │   ├── src/components/   # frog-command-panel, frog-agent-stream, etc.
│   │   ├── src/client/       # Gateway & SSE clients
│   │   └── src/styles/       # CSS tokens, reset, surfaces
│   ├── react-adapter/        # React wrappers & hooks
│   └── shared-contracts/     # JSON schemas & TypeScript types
├── database/
│   ├── postgres/init/        # SQL migrations (pgvector, agent_memory, audit)
│   └── redis/                # Redis configuration
├── infra/
│   ├── docker/               # Dockerfiles for each service
│   ├── security/             # Threat model & sandbox policy
│   └── observability/        # Prometheus config
├── scripts/                  # Utility scripts
│   ├── download_model.sh     # Download AI model
│   ├── dev.sh                # Start dev environment
│   ├── build-all.sh          # Build all services
│   └── reset-local-db.sh     # Reset database
├── docs/                     # Documentation
├── tests/                    # Integration, load, and E2E test specs
├── docker-compose.yml        # Full stack orchestration
├── .env.example              # Environment variable template
└── package.json              # Node.js workspace root
```

---

## Configuration

All configuration is done via environment variables. Copy `.env.example` to `.env` and customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `FROGUI_ENV` | `development` | Environment mode |
| `GATEWAY_HOST` | `0.0.0.0` | API Gateway bind address |
| `GATEWAY_PORT` | `3001` | API Gateway port |
| `CORE_ENGINE_URL` | `http://core-engine:8080` | C++ engine URL (Docker internal) |
| `POSTGRES_HOST` | `postgres` | PostgreSQL host |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `POSTGRES_DB` | `frogui` | Database name |
| `POSTGRES_USER` | `frogui` | Database username |
| `POSTGRES_PASSWORD` | *(set in .env)* | **Database password — change for production!** |
| `DATABASE_URL` | *(auto-composed)* | Full PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379` | Redis connection string |
| `STUDIO_PORT` | `5173` | Studio UI port |

---

## Development Guide

### Running with Docker (Recommended)

```bash
# Start all services
docker compose up --build

# Start in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Reset database
docker compose down -v   # removes volumes too
bash scripts/reset-local-db.sh
```

### Building Individual Services

#### C++ Core Engine

```bash
cd apps/core-engine

# Download model first
bash ../../scripts/download_model.sh

# Build
cmake -B build -S .
cmake --build build --config Release

# Run tests
ctest --test-dir build --output-on-failure
```

**Dependencies:** CMake 3.20+, C++20 compiler, libpq-dev

#### Rust API Gateway

```bash
cd apps/api-gateway

# Check
cargo check

# Build
cargo build --release

# Run tests
cargo test

# Run
cargo run
```

**Dependencies:** Rust 1.75+, libpq

#### UI Packages

```bash
# Install all workspace dependencies
npm install

# Start Studio dev server
npm run dev:studio

# Build Studio
npm run build:studio
```

---

## Deployment to VPS

### Step 1: Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Logout and login again for group changes
```

### Step 2: Clone & Configure

```bash
git clone https://github.com/Firdan19/FrogUI.git
cd FrogUI

# Create production environment
cp .env.example .env
nano .env
```

**Edit `.env` for production:**

```bash
FROGUI_ENV=production
POSTGRES_PASSWORD=<GANTI_DENGAN_PASSWORD_KUAT>
DATABASE_URL=postgres://frogui:<PASSWORD_KUAT>@postgres:5432/frogui
```

### Step 3: Download Model & Launch

```bash
# Download AI model
bash scripts/download_model.sh

# Build and start
docker compose up --build -d

# Check status
docker compose ps
docker compose logs -f
```

### Step 4: Setup Domain & HTTPS (Optional)

Install Nginx reverse proxy + Let's Encrypt SSL:

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/frogui
```

Example Nginx config:

```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/frogui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## API Reference

### Health Check

```
GET /api/health
```

### Send Command to Agent

```
POST /api/command
Content-Type: application/json

{
  "command": "analyze this data",
  "context": {}
}
```

### Subscribe to Agent Events (SSE)

```
GET /api/events
Accept: text/event-stream
```

See [docs/api-reference.md](docs/api-reference.md) for the full API documentation.

---

## Troubleshooting

### Docker Compose fails to build

```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -f
docker compose up --build
```

### Model download fails

```bash
# Manual download
cd apps/core-engine/models
curl -L -o tinyllama.gguf "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf?download=true"
```

### PostgreSQL connection refused

Make sure the database is running:

```bash
docker compose ps postgres
docker compose logs postgres
```

### Port already in use

```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
