FROM gcc:13 AS build

RUN apt-get update && apt-get install -y --no-install-recommends cmake make g++ libpq-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY apps/core-engine ./apps/core-engine
WORKDIR /workspace/apps/core-engine
RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release \
  && cmake --build build -j 2

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /workspace/apps/core-engine/build/frogui-core-engine /app/frogui-core-engine
EXPOSE 8080
CMD ["/app/frogui-core-engine"]

