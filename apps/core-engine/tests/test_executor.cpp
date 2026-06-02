#include <catch2/catch_test_macros.hpp>
#include "frogui/task_executor.hpp"

using namespace frogui;

TEST_CASE("Sandbox Policy - is_command_safe blocks dangerous commands", "[security]") {
    TaskExecutor executor;
    
    // Safe commands
    REQUIRE(executor.is_command_safe("ls -l") == true);
    REQUIRE(executor.is_command_safe("echo hello") == true);
    REQUIRE(executor.is_command_safe("cat /tmp/test.txt") == true);
    
    // Dangerous commands
    REQUIRE(executor.is_command_safe("rm -rf /") == false);
    REQUIRE(executor.is_command_safe("sudo rm -rf") == false);
    REQUIRE(executor.is_command_safe("cat /etc/passwd") == false);
    REQUIRE(executor.is_command_safe("cat /etc/shadow") == false);
    REQUIRE(executor.is_command_safe("mkfs.ext4 /dev/sda1") == false);
    
    // Combined dangerous commands
    REQUIRE(executor.is_command_safe("ls -l && rm -rf /etc") == false);
    REQUIRE(executor.is_command_safe("echo test ; sudo apt install") == false);
}
