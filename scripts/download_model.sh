#!/bin/bash
set -e

MODEL_DIR="apps/core-engine/models"
MODEL_URL="https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf?download=true"
MODEL_PATH="$MODEL_DIR/tinyllama.gguf"

mkdir -p "$MODEL_DIR"

if [ ! -f "$MODEL_PATH" ]; then
  echo "Downloading TinyLlama Q4_K_M (approx 637 MB)..."
  curl -L -o "$MODEL_PATH" "$MODEL_URL"
  echo "Download complete!"
else
  echo "Model already exists at $MODEL_PATH"
fi
