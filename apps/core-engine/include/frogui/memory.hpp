#pragma once

#include <string>
#include <vector>

namespace frogui {

class MemoryStore {
public:
  MemoryStore();

  std::vector<std::string> recall(const std::string& command) const;
  void remember(const std::string& task_id, const std::string& content) const;

private:
  std::string get_connection_string() const;
  std::string generate_dummy_embedding() const;
};

}  // namespace frogui

