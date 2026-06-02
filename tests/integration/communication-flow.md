# Integration Test Plan

1. Start Docker Compose.
2. Send `POST /api/command` to the Rust gateway.
3. Open the returned SSE stream.
4. Confirm gateway events arrive before core engine events.
5. Confirm final output is rendered in the Studio UI.

