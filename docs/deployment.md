# Deployment

FrogUI is designed to run from one Docker Compose environment.

```sh
docker compose up --build
```

Copy `.env.example` to `.env` only when you want to override the default development values.

The compose stack starts:

- `core-engine`: internal C++ runtime on `8080`.
- `api-gateway`: Rust gateway on `3001`.
- `studio`: local UI on `5173`.
- `postgres`: self-hosted pgvector database.
- `redis`: in-memory cache and state store.

The C++ service is intentionally not published to the host. Browser traffic must go through the Rust gateway.
