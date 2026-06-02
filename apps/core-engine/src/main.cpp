#include <cstdlib>
#include <iostream>

#include "frogui/http_server.hpp"

int main() {
  const char* port_value = std::getenv("CORE_ENGINE_PORT");
  const int port = port_value == nullptr ? 8080 : std::atoi(port_value);

  std::cout << "FrogUI Core Engine listening on internal port " << port << '\n';
  frogui::HttpServer server(port);
  return server.run();
}

