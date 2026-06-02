#pragma once

#include <string>
#include <functional>

// Forward declarations for llama.cpp types to avoid pulling in llama.h in the header
struct llama_model;
struct llama_context;

namespace frogui {

class InferenceRuntime {
public:
  InferenceRuntime();
  ~InferenceRuntime();

  std::string complete(const std::string& command) const;
  void complete_stream(const std::string& command, std::function<void(const std::string&)> on_token) const;

private:
  llama_model* model_ = nullptr;
  llama_context* ctx_ = nullptr;
};

}  // namespace frogui

