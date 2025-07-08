#!/bin/bash

# Unified Test Script for Build Your Own Grep - All Completed Stages

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

echo "🔹 Running all completed stage tests..."

# -------------------
# Stage 1: Literal Match
# -------------------

run_test "hello world" "world" yes "Literal match for 'world' in 'hello world'"
run_test "test" "nope" no "No match for 'nope' in 'test'"
run_test "" "a" no "Empty input shouldn't match any literal"

# -------------------
# Stage 2–3: \w tests
# -------------------

run_test "abc" "\\w" yes "\\w matches letter"
run_test "123" "\\w" yes "\\w matches digit"
run_test "_" "\\w" yes "\\w matches underscore"
run_test "!@#" "\\w" no "\\w does not match symbols"
run_test "" "\\w" no "Empty input shouldn't match"

# -------------------
# Stage 2–3: \d tests
# -------------------

run_test "7" "\\d" yes "\\d matches single digit"
run_test "abc123" "\\d" yes "\\d matches a digit in the middle"
run_test "abc" "\\d" no "\\d shouldn't match letters"
run_test "!@#5$" "\\d" yes "\\d matches digit among symbols"
run_test "" "\\d" no "Empty input shouldn't match digits"

# -------------------
# Stage 4: Positive character groups [xyz]
# -------------------

run_test "zebra" "[xyz]" yes "[xyz] should match 'z'"
run_test "yellow" "[xyz]" yes "[xyz] should match 'y'"
run_test "fix" "[xyz]" yes "[xyz] should match 'x'"
run_test "alpha" "[xyz]" no "[xyz] shouldn't match anything in 'alpha'"
run_test "123" "[xyz]" no "digits shouldn't match [xyz]"
run_test "" "[xyz]" no "Empty input shouldn't match [xyz]"

# -------------------
# Stage 5: Negative character groups [^abc]
# -------------------

run_test "apple" "[^abc]" yes "'apple' has 'p','l','e' — match"
run_test "cab" "[^abc]" no "Only a/b/c present — no match"
run_test "ccc" "[^abc]" no "Only 'c's — no match"
run_test "banana" "[^xyz]" yes "'banana' has letters not in x/y/z"
run_test "xyz" "[^xyz]" no "Only x/y/z — no match"
run_test "" "[^abc]" no "Empty input — no match"

# -------------------------------
# Stage 6: Sequential pattern matching with character classes
# -------------------------------

run_test "1 apple" "\\d apple" yes "Matches digit + space + 'apple'"
run_test "1 orange" "\\d apple" no "Word is not 'apple' — should not match"
run_test "100 apples" "\\d\\d\\d apple" yes "Matches 3 digits + space + 'apple'"
run_test "10 apple" "\\d\\d\\d apple" no "Only 2 digits — should not match"
run_test "3 dogs" "\\d \\w\\w\\ws" yes "Matches digit + space + 3 word chars + 's'"
run_test "4 cats" "\\d \\w\\w\\ws" yes "Matches digit + space + 3 word chars + 's'"
run_test "1 dog" "\\d \\w\\w\\ws" no "No 's' at end — should not match"
run_test "5 hats" "\\d \\w\\w\\ws" yes "Valid match with 'hats'"
run_test "apple" "\\d apple" no "Missing digit — should not match"
run_test "" "\\d \\w\\w\\ws" no "Empty string — should not match"

echo "✅ All tests completed."
