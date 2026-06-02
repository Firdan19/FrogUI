cmake_minimum_required(VERSION 3.20)
project(frogui_core_engine VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(frogui-core-engine
  src/main.cpp
  src/agent.cpp
  src/http_server.cpp
  src/inference.cpp
  src/memory.cpp
  src/task_executor.cpp
  src/context_manager.cpp
)

include(FetchContent)
FetchContent_Declare(
  llama
  GIT_REPOSITORY https://github.com/ggerganov/llama.cpp.git
  GIT_TAG b5450
  GIT_SHALLOW ON
)

set(LLAMA_BUILD_TESTS OFF CACHE BOOL "Disable llama.cpp tests" FORCE)
set(LLAMA_BUILD_EXAMPLES OFF CACHE BOOL "Disable llama.cpp examples" FORCE)
set(LLAMA_BUILD_SERVER OFF CACHE BOOL "Disable llama.cpp server" FORCE)

FetchContent_MakeAvailable(llama)

FetchContent_Declare(
  libpqxx
  GIT_REPOSITORY https://github.com/jtv/libpqxx.git
  GIT_TAG 7.7.5
  GIT_SHALLOW ON
)
set(SKIP_BUILD_TEST ON CACHE BOOL "Skip building libpqxx tests" FORCE)
set(BUILD_DOC OFF CACHE BOOL "Skip building libpqxx docs" FORCE)
FetchContent_MakeAvailable(libpqxx)

target_include_directories(frogui-core-engine PRIVATE include)
target_link_libraries(frogui-core-engine PRIVATE llama pqxx)

if(UNIX)
  target_compile_options(frogui-core-engine PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Tests
FetchContent_Declare(
  Catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.4.0
  GIT_SHALLOW ON
)
FetchContent_MakeAvailable(Catch2)

enable_testing()
add_executable(frogui-core-tests
  tests/main_test.cpp
  tests/test_executor.cpp
  src/task_executor.cpp
)
target_include_directories(frogui-core-tests PRIVATE include)
target_link_libraries(frogui-core-tests PRIVATE Catch2::Catch2WithMain)
add_test(NAME core_tests COMMAND frogui-core-tests)

