#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() {
  echo -e "${GREEN}PASS${NC}: $1"
}

fail() {
  echo -e "${RED}FAIL${NC}: $1"
}

run_test() {
  input="$1"
  pattern="$2"
  expect_match="$3"
  description="$4"

  echo -n "$input" | ./your_program.sh -E "$pattern" >output.txt
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
# Tests for \w
# -------------------

run_test "abc" "\\w" yes "\\w should match first word character"
run_test "123" "\\w" yes "\\w should match digits"
run_test "_" "\\w" yes "\\w should match underscore"
run_test "!@#" "\\w" no "\\w should not match special characters"
run_test "" "\\w" no "\\w should not match empty input"

# -------------------
# Tests for \d
# -------------------

run_test "7" "\\d" yes "\\d should match single digit"
run_test "abc123" "\\d" yes "\\d should match first digit"
run_test "abc" "\\d" no "\\d should not match letters"
run_test "!@#5$" "\\d" yes "\\d should match digit among symbols"
run_test "" "\\d" no "\\d should not match empty input"

echo "Test completed."
