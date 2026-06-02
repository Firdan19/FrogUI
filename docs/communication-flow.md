# Communication Flow

1. The user types a command into `frog-command-panel` or a React wrapper.
2. The frontend sends `POST /api/command` to the Rust API Gateway.
3. The gateway validates JSON, creates a `task_id`, stores pending state in memory and Redis, then returns a `stream_url`.
4. The frontend opens `GET /api/stream/{task_id}` with EventSource.
5. The gateway removes the pending command and calls the C++ Core Engine at `POST /v1/agent/run`.
6. The C++ engine runs the agent pipeline: memory recall, inference placeholder, task execution, and memory writeback hook.
7. The C++ engine returns structured events to Rust.
8. Rust emits each event as SSE.
9. The UI renders events in realtime.

```txt
Browser
  -> POST /api/command
  -> Rust Gateway
  -> Redis task cache
  -> GET /api/stream/{task_id}
  -> Rust Gateway
  -> POST core-engine:8080/v1/agent/run
  -> C++ Core Engine
  -> PostgreSQL + pgvector memory hooks
  -> Rust SSE
  -> Browser
```

