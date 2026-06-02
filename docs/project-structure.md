# Project Structure

```txt
FrogUI/
|- README.md
|- LICENSE
|- docker-compose.yml
|- .env.example
|- .gitignore
|- package.json
|
|- apps/
|  |- core-engine/
|  |  |- CMakeLists.txt
|  |  |- include/frogui/
|  |  |  |- agent.hpp
|  |  |  |- http_server.hpp
|  |  |  |- inference.hpp
|  |  |  |- memory.hpp
|  |  |  `- task_executor.hpp
|  |  |- src/
|  |  |  |- main.cpp
|  |  |  |- agent.cpp
|  |  |  |- http_server.cpp
|  |  |  |- inference.cpp
|  |  |  |- memory.cpp
|  |  |  `- task_executor.cpp
|  |  |- protocols/
|  |  |  |- agent_request.schema.json
|  |  |  `- agent_response.schema.json
|  |  `- tests/
|  |
|  |- api-gateway/
|  |  |- Cargo.toml
|  |  |- src/
|  |  |  |- main.rs
|  |  |  |- config.rs
|  |  |  |- routes/
|  |  |  |  |- command.rs
|  |  |  |  |- health.rs
|  |  |  |  |- mod.rs
|  |  |  |  `- sse.rs
|  |  |  |- middleware/
|  |  |  |  |- auth.rs
|  |  |  |  |- mod.rs
|  |  |  |  |- rate_limit.rs
|  |  |  |  `- request_guard.rs
|  |  |  |- models/
|  |  |  |  |- agent.rs
|  |  |  |  `- mod.rs
|  |  |  `- services/
|  |  |     |- core_client.rs
|  |  |     |- memory.rs
|  |  |     |- mod.rs
|  |  |     |- redis_state.rs
|  |  |     `- stream.rs
|  |  `- tests/
|  |
|  `- studio/
|     |- index.html
|     |- package.json
|     `- src/
|        |- main.js
|        |- layout/
|        |- views/
|        `- theme/app.css
|
|- packages/
|  |- ui-core/
|  |  |- package.json
|  |  |- src/
|  |  |  |- index.js
|  |  |  |- client/
|  |  |  |  |- gateway-client.js
|  |  |  |  `- sse-client.js
|  |  |  |- components/
|  |  |  |  |- frog-agent-stream.js
|  |  |  |  |- frog-command-panel.js
|  |  |  |  |- frog-memory-view.js
|  |  |  |  `- frog-status-indicator.js
|  |  |  `- styles/
|  |  |     |- reset.css
|  |  |     |- surfaces.css
|  |  |     `- tokens.css
|  |  `- tests/
|  |
|  |- react-adapter/
|  |  |- package.json
|  |  |- src/
|  |  |  |- index.js
|  |  |  |- components/
|  |  |  |  |- FrogAgentStream.jsx
|  |  |  |  `- FrogCommandPanel.jsx
|  |  |  `- hooks/
|  |  |     |- useFrogAgent.js
|  |  |     |- useFrogMemory.js
|  |  |     `- useFrogStream.js
|  |  `- tests/
|  |
|  `- shared-contracts/
|     |- agent-command.schema.json
|     |- agent-event.schema.json
|     `- types/agent.d.ts
|
|- database/
|  |- postgres/
|  |  |- init/
|  |  |  |- 001_enable_pgvector.sql
|  |  |  |- 002_agent_memory.sql
|  |  |  `- 003_audit_log.sql
|  |  `- migrations/
|  `- redis/
|     `- redis.conf
|
|- infra/
|  |- docker/
|  |  |- api-gateway.Dockerfile
|  |  |- core-engine.Dockerfile
|  |  `- studio.Dockerfile
|  |- observability/
|  |  |- prometheus.yml
|  |  `- grafana/
|  `- security/
|     |- sandbox-policy.md
|     `- threat-model.md
|
|- docs/
|  |- api-reference.md
|  |- architecture.md
|  |- communication-flow.md
|  |- deployment.md
|  |- project-structure.md
|  `- ui-design-principles.md
|
|- examples/
|  |- react/
|  `- vanilla-web-components/
|
|- scripts/
|  |- build-all.sh
|  |- dev.sh
|  `- reset-local-db.sh
|
`- tests/
   |- e2e/
   |- integration/
   `- load/
```

