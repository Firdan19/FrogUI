FROM rust:1-bookworm AS build

WORKDIR /workspace
COPY apps/api-gateway ./apps/api-gateway
WORKDIR /workspace/apps/api-gateway
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /workspace/apps/api-gateway/target/release/frogui-api-gateway /app/frogui-api-gateway
EXPOSE 3001
CMD ["/app/frogui-api-gateway"]

