#include "frogui/agent.hpp"

#include <sstream>

#include "frogui/inference.hpp"
#include "frogui/memory.hpp"
#include "frogui/task_executor.hpp"

namespace frogui {

AgentResponse Agent::run(const AgentRequest& request) const {
  MemoryStore memory;
  InferenceRuntime inference;
  TaskExecutor executor;

  AgentResponse response;
  response.task_id = request.task_id;
  response.events.push_back({"received", "Command accepted by C++ core engine."});

  const auto memories = memory.recall(request.command);
  std::ostringstream memory_summary;
  memory_summary << "Loaded " << memories.size() << " semantic memory candidate(s).";
  response.events.push_back({"memory", memory_summary.str()});

  const std::string inference_text = inference.complete(request.command);
  response.events.push_back({"inference", inference_text});

  response.final_text = executor.execute(request.command, inference_text);
  memory.remember(request.task_id, response.final_text);
  response.events.push_back({"complete", response.final_text});

  return response;
}

void Agent::run_stream(const AgentRequest& request, std::function<void(const AgentEvent&)> on_event) const {
  MemoryStore memory;
  InferenceRuntime inference;
  TaskExecutor executor;

  on_event({"received", "Command accepted by C++ core engine (streaming)."});

  const auto memories = memory.recall(request.command);
  std::ostringstream memory_summary;
  memory_summary << "Loaded " << memories.size() << " semantic memory candidate(s).";
  on_event({"memory", memory_summary.str()});

  std::string full_inference;
  inference.complete_stream(request.command, [&](const std::string& token) {
    on_event({"inference_token", token});
    full_inference += token;
  });

  std::string final_text = executor.execute(request.command, full_inference);
  memory.remember(request.task_id, final_text);
  
  on_event({"complete", final_text});
}

}  // namespace frogui
