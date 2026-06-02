# API Reference

## `GET /health`

Returns gateway health.

## `POST /api/command`

Creates an agent task.

Request:

```json
{
  "command": "Summarize the current workspace state"
}
```

Response:

```json
{
  "task_id": "uuid",
  "status": "queued",
  "stream_url": "/api/stream/uuid"
}
```

## `GET /api/stream/{task_id}`

Opens an SSE stream for a pending task.

Event names:

- `queued`
- `gateway`
- `memory`
- `inference`
- `complete`
- `final`
- `error`

## Internal `POST /v1/agent/run`

Gateway-to-core endpoint. This is used by Rust only.

