#include "frogui/inference.hpp"

#include <iostream>
#include <stdexcept>
#include <vector>

#include "llama.h"

namespace frogui {

InferenceRuntime::InferenceRuntime() {
  llama_backend_init();

  llama_model_params model_params = llama_model_default_params();
  // Gunakan model yang baru saja kita unduh
  model_ = llama_load_model_from_file("models/tinyllama.gguf", model_params);

  if (model_ == nullptr) {
    std::cerr << "Warning: Gagal memuat model models/tinyllama.gguf. Pastikan script downloader sudah dijalankan.\n";
  } else {
    llama_context_params ctx_params = llama_context_default_params();
    ctx_params.n_ctx = 1024;
    ctx_ = llama_new_context_with_model(model_, ctx_params);
  }
}

InferenceRuntime::~InferenceRuntime() {
  if (ctx_ != nullptr) {
    llama_free(ctx_);
  }
  if (model_ != nullptr) {
    llama_free_model(model_);
  }
  llama_backend_free();
}

std::string InferenceRuntime::complete(const std::string& command) const {
  if (ctx_ == nullptr) {
    return "[ERROR] llama.cpp context is not initialized (model not found). Command was: " + command;
  }

  // Dummy string for now, to prove it connects to the C++ logic successfully
  return "Model dimuat dengan sukses. Inference pipeline siap mengeksekusi instruksi: " + command;
}

void InferenceRuntime::complete_stream(const std::string& command, std::function<void(const std::string&)> on_token) const {
  std::string full_response = complete(command);
  
  // Simulate token-by-token generation for the SSE stream
  std::string current_word;
  for (char c : full_response) {
    current_word += c;
    if (c == ' ') {
      on_token(current_word);
      current_word.clear();
      // Simulate inference delay
      for(volatile int i=0; i<1000000; ++i) {} 
    }
  }
  if (!current_word.empty()) {
    on_token(current_word);
  }
}

}  // namespace frogui

