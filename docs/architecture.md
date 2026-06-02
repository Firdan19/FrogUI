# FrogUI Architecture

FrogUI is organized as a monorepo with strict runtime separation.

## Core Engine

The C/C++ core engine owns performance-sensitive agent execution. It is responsible for inference orchestration, task execution, and low-level memory hooks. It listens on internal port `8080` and is not intended to be exposed to users or browsers.

## API Gateway

The Rust Actix-Web gateway is the only public backend entrypoint. It validates commands, manages pending task state, calls the C++ engine, and streams agent events back to the browser using Server-Sent Events.

## Data Layer

PostgreSQL with `pgvector` stores durable semantic memory. Redis stores short-lived runtime state and enables future streaming fanout, cancellation, and realtime coordination.

## UI Layer

The core UI is pure Web Components with Shadow DOM. React support is provided through adapter components and hooks, but the visual foundation remains framework-independent.

