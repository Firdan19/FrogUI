#pragma once

#include <string>

namespace frogui {

class TaskExecutor {
public:
  std::string execute(const std::string& command, const std::string& inference) const;
};

}  // namespace frogui

