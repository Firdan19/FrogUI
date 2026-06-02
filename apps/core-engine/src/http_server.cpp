#include "frogui/http_server.hpp"

#include <algorithm>
#include <cerrno>
#include <cstring>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>

#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

namespace {

std::string json_escape(const std::string& value) {
  std::ostringstream escaped;
  for (const char character : value) {
    switch (character) {
      case '\\':
        escaped << "\\\\";
        break;
      case '"':
        escaped << "\\\"";
        break;
      case '\n':
        escaped << "\\n";
        break;
      case '\r':
        escaped << "\\r";
        break;
      case '\t':
        escaped << "\\t";
        break;
      default:
        escaped << character;
        break;
    }
  }
  return escaped.str();
}

std::string extract_json_string(const std::string& body, const std::string& key) {
  const std::string needle = "\"" + key + "\"";
  const auto key_position = body.find(needle);
  if (key_position == std::string::npos) {
    return "";
  }

  const auto colon_position = body.find(':', key_position + needle.size());
  if (colon_position == std::string::npos) {
    return "";
  }

  const auto start_quote = body.find('"', colon_position + 1);
  if (start_quote == std::string::npos) {
    return "";
  }

  std::string result;
  bool escaping = false;
  for (size_t i = start_quote + 1; i < body.size(); ++i) {
    const char current = body[i];
    if (escaping) {
      result.push_back(current);
      escaping = false;
      continue;
    }
    if (current == '\\') {
      escaping = true;
      continue;
    }
    if (current == '"') {
      return result;
    }
    result.push_back(current);
  }
  return result;
}

std::string response_with_body(const std::string& status, const std::string& content_type, const std::string& body) {
  std::ostringstream response;
  response << "HTTP/1.1 " << status << "\r\n"
           << "Content-Type: " << content_type << "\r\n"
           << "Content-Length: " << body.size() << "\r\n"
           << "Connection: close\r\n"
           << "\r\n"
           << body;
  return response.str();
}

std::string serialize_agent_response(const frogui::AgentResponse& response) {
  std::ostringstream body;
  body << "{\"task_id\":\"" << json_escape(response.task_id) << "\",\"events\":[";
  for (size_t i = 0; i < response.events.size(); ++i) {
    const auto& event = response.events[i];
    if (i > 0) {
      body << ',';
    }
    body << "{\"type\":\"" << json_escape(event.type) << "\",\"content\":\"" << json_escape(event.content) << "\"}";
  }
  body << "],\"final_text\":\"" << json_escape(response.final_text) << "\"}";
  return body.str();
}

}  // namespace

namespace frogui {

HttpServer::HttpServer(int port) : port_(port) {}

int HttpServer::run() {
  const int server_fd = socket(AF_INET, SOCK_STREAM, 0);
  if (server_fd < 0) {
    std::cerr << "Failed to create socket.\n";
    return 1;
  }

  int option = 1;
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &option, sizeof(option));

  sockaddr_in address{};
  address.sin_family = AF_INET;
  address.sin_addr.s_addr = INADDR_ANY;
  address.sin_port = htons(port_);

  if (bind(server_fd, reinterpret_cast<sockaddr*>(&address), sizeof(address)) < 0) {
    std::cerr << "Failed to bind core engine to port " << port_ << ": " << std::strerror(errno) << ".\n";
    close(server_fd);
    return 1;
  }

  if (listen(server_fd, 16) < 0) {
    std::cerr << "Failed to listen on core engine socket: " << std::strerror(errno) << ".\n";
    close(server_fd);
    return 1;
  }

  while (true) {
    sockaddr_in client_address{};
    socklen_t client_length = sizeof(client_address);
    const int client_fd = accept(server_fd, reinterpret_cast<sockaddr*>(&client_address), &client_length);
    if (client_fd < 0) {
      continue;
    }

    char buffer[16384] = {};
    const ssize_t bytes_read = recv(client_fd, buffer, sizeof(buffer) - 1, 0);
    if (bytes_read > 0) {
      const std::string raw_request(buffer, static_cast<size_t>(bytes_read));
      handle_request(client_fd, raw_request);
    }
    close(client_fd);
  }
}

void HttpServer::handle_request(int client_fd, const std::string& raw_request) const {
  if (raw_request.rfind("GET /health", 0) == 0) {
    std::string res = response_with_body("200 OK", "application/json", "{\"status\":\"ok\",\"service\":\"core-engine\"}");
    send(client_fd, res.c_str(), res.size(), 0);
    return;
  }

  if (raw_request.rfind("POST /v1/agent/run", 0) != 0) {
    std::string res = response_with_body("404 Not Found", "application/json", "{\"error\":\"route_not_found\"}");
    send(client_fd, res.c_str(), res.size(), 0);
    return;
  }

  const auto body_position = raw_request.find("\r\n\r\n");
  const std::string body = body_position == std::string::npos ? "" : raw_request.substr(body_position + 4);

  AgentRequest request;
  request.task_id = extract_json_string(body, "task_id");
  request.command = extract_json_string(body, "command");

  if (request.task_id.empty() || request.command.empty()) {
    std::string res = response_with_body("400 Bad Request", "application/json", "{\"error\":\"task_id_and_command_are_required\"}");
    send(client_fd, res.c_str(), res.size(), 0);
    return;
  }

  // Send SSE headers
  std::string headers = "HTTP/1.1 200 OK\r\n"
                        "Content-Type: text/event-stream\r\n"
                        "Cache-Control: no-cache\r\n"
                        "Connection: keep-alive\r\n\r\n";
  send(client_fd, headers.c_str(), headers.size(), 0);

  // Stream events from Agent
  agent_.run_stream(request, [client_fd](const AgentEvent& event) {
    std::ostringstream data_stream;
    data_stream << "data: {\"type\":\"" << json_escape(event.type) 
                << "\",\"content\":\"" << json_escape(event.content) << "\"}\n\n";
    std::string data = data_stream.str();
    send(client_fd, data.c_str(), data.size(), 0);
  });
}

}  // namespace frogui
