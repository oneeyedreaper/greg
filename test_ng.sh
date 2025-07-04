#!/bin/bash

# Colored output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() {
  echo -e "${GREEN}PASS${NC}: $1"
}

fail() {
  echo -e "${RED}FAIL${NC}: $1"
}

# Test runner
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

# -------------------------------
# Tests for Negative Groups [^abc]
# -------------------------------

run_test "apple" "[^abc]" yes "'apple' has 'p', 'l', 'e' — not a/b/c, should match"
run_test "cab" "[^abc]" no "'cab' contains only a/b/c — shouldn't match"
run_test "ccc" "[^abc]" no "Only 'c's — shouldn't match"
run_test "banana" "[^xyz]" yes "'banana' has letters not in x/y/z — should match"
run_test "xyz" "[^xyz]" no "'xyz' has only x/y/z — shouldn't match"
run_test "" "[^abc]" no "Empty input — should not match"

echo "Negative character group tests completed."
