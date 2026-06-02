#include "frogui/context_manager.hpp"

#include <sstream>

namespace frogui {

std::string ContextManager::format_prompt(const std::string& system_instruction, const std::string& user_command) const {
  std::ostringstream formatted;
  
  // Format ChatML standar (didukung oleh TinyLlama)
  formatted << "<|system|>\n"
            << system_instruction << "</s>\n"
            << "<|user|>\n"
            << user_command << "</s>\n"
            << "<|assistant|>\n";

  return formatted.str();
}

}  // namespace frogui
