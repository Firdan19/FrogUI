#pragma once

#include <string>
#include <vector>
#include <functional>

namespace frogui {

struct AgentRequest {
  std::string task_id;
  std::string command;
};

struct AgentEvent {
  std::string type;
  std::string content;
};

struct AgentResponse {
  std::string task_id;
  std::vector<AgentEvent> events;
  std::string final_text;
};


class Agent {
public:
  void run_stream(const AgentRequest& request, std::function<void(const AgentEvent&)> on_event) const;
  AgentResponse run(const AgentRequest& request) const;
};

}  // namespace frogui

