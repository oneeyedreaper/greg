#!/bin/bash

# Output colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() {
  echo -e "${GREEN}PASS${NC}: $1"
}

fail() {
  echo -e "${RED}FAIL${NC}: $1"
}

# Function to run a test
run_test() {
  input="$1"
  pattern="$2"
  expect_match="$3"
  description="$4"

  echo -n "$input" | ./your_program.sh -E "$pattern" >/dev/null
  result=$?

  if [[ "$expect_match" == "yes" && "$result" -eq 0 ]]; then
    pass "$description"
  elif [[ "$expect_match" == "no" && "$result" -ne 0 ]]; then
    pass "$description"
  else
    fail "$description (exit code: $result)"
  fi
}

# -------------------
# Tests for [xyz]
# -------------------

run_test "zebra" "[xyz]" yes "'zebra' contains 'z' — should match [xyz]"
run_test "yellow" "[xyz]" yes "'yellow' contains 'y' — should match [xyz]"
run_test "fix" "[xyz]" yes "'fix' contains 'x' — should match [xyz]"
run_test "alpha" "[xyz]" no "'alpha' has no x/y/z — shouldn't match [xyz]"
run_test "123" "[xyz]" no "digits should not match [xyz]"
run_test "" "[xyz]" no "empty input — shouldn't match [xyz]"

echo "Positive character group tests completed."
