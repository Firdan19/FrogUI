#include "frogui/task_executor.hpp"
#include <stdexcept>
#include <algorithm>
#include <vector>

namespace frogui {

bool is_command_safe(const std::string& command) {
  // Daftar perintah berbahaya dasar yang diblokir oleh Sandbox Policy
  std::vector<std::string> blocked_keywords = {
    "rm -rf", "sudo", "/etc/passwd", "chmod 777", "mkfs"
  };

  std::string lower_cmd = command;
  std::transform(lower_cmd.begin(), lower_cmd.end(), lower_cmd.begin(), ::tolower);

  for (const auto& keyword : blocked_keywords) {
    if (lower_cmd.find(keyword) != std::string::npos) {
      return false;
    }
  }
  return true;
}

std::string TaskExecutor::execute(const std::string& command, const std::string& inference) const {
  if (!is_command_safe(command) || !is_command_safe(inference)) {
    return "[SECURITY ALERT] Sandbox Policy menolak eksekusi perintah karena terdeteksi instruksi berbahaya yang melanggar kebijakan.";
  }

  return "Task execution complete. Command: " + command + " | Runtime: " + inference;
}

}  // namespace frogui

