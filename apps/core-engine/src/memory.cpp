#include "frogui/memory.hpp"

#include <cstdlib>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <pqxx/pqxx>

namespace frogui {

MemoryStore::MemoryStore() {}

std::string MemoryStore::get_connection_string() const {
  const char* db_url = std::getenv("DATABASE_URL");
  if (db_url != nullptr) {
    return std::string(db_url);
  }
  return "postgresql://frogui:frogui_dev_password@localhost:5432/frogui";
}

std::string MemoryStore::generate_dummy_embedding() const {
  // Generate dummy 1536-dimensional vector string for pgvector format: "[0.1, 0.2, ...]"
  std::ostringstream oss;
  oss << "[";
  for (int i = 0; i < 1536; ++i) {
    if (i > 0) oss << ",";
    oss << "0.0";
  }
  oss << "]";
  return oss.str();
}

std::vector<std::string> MemoryStore::recall(const std::string& command) const {
  if (command.empty()) return {};

  std::vector<std::string> memories;
  try {
    pqxx::connection c(get_connection_string());
    pqxx::work w(c);

    std::string dummy_vector = generate_dummy_embedding();
    
    // Gunakan pgvector cosine distance `<=>` untuk mencari memori terdekat
    pqxx::result r = w.exec_params(
        "SELECT content FROM agent_memory ORDER BY embedding <=> $1::vector LIMIT 2",
        dummy_vector
    );

    for (auto const& row : r) {
      memories.push_back(row["content"].c_str());
    }
  } catch (const std::exception& e) {
    std::cerr << "MemoryStore recall error: " << e.what() << "\n";
  }

  return memories;
}

void MemoryStore::remember(const std::string& task_id, const std::string& content) const {
  try {
    pqxx::connection c(get_connection_string());
    pqxx::work w(c);

    std::string dummy_vector = generate_dummy_embedding();

    w.exec_params(
        "INSERT INTO agent_memory (task_id, content, embedding) VALUES ($1, $2, $3::vector)",
        task_id, content, dummy_vector
    );
    w.commit();
  } catch (const std::exception& e) {
    std::cerr << "MemoryStore remember error: " << e.what() << "\n";
  }
}

}  // namespace frogui


