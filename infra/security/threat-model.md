# FrogUI Threat Model

## Assets

- Agent commands and outputs.
- Semantic memory stored in PostgreSQL + pgvector.
- Realtime task state stored in Redis.
- Internal C++ inference runtime.

## Primary Boundaries

- Browser to Rust API Gateway.
- Rust API Gateway to C++ Core Engine.
- Runtime services to PostgreSQL and Redis.

## Initial Controls

- Payload size limits at the gateway.
- Internal-only core engine port.
- SSE stream scoped by task id.
- Short-lived Redis keys.
- Audit table for task actions.

