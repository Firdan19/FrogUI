#pragma once

#include <string>

#include "frogui/agent.hpp"

namespace frogui {

class HttpServer {
public:
  explicit HttpServer(int port);
  int run();

private:
  void handle_request(int client_fd, const std::string& raw_request) const;

  int port_;
  Agent agent_;
};

}  // namespace frogui
