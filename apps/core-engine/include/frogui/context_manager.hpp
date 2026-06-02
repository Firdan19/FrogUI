#pragma once

#include <string>

namespace frogui {

class ContextManager {
public:
  // Memformat prompt mentah dari user ke dalam format instruksi model spesifik (misal ChatML / Llama-3 format)
  std::string format_prompt(const std::string& system_instruction, const std::string& user_command) const;
};

}  // namespace frogui
