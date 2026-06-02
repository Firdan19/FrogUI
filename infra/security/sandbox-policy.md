# FrogUI Sandbox Policy

FrogUI routes all external traffic through the Rust API Gateway before any request reaches the C++ Core Engine.

Initial policy:

- The C++ service is internal-only and exposed only on the Docker network.
- The gateway validates payload size and shape before task creation.
- Redis stores short-lived task state.
- PostgreSQL stores durable memory and audit records.
- UI surfaces are single-user by design and must not expose community, social, invite, feed, or collaboration patterns.

