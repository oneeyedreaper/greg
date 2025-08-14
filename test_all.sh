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

# -------------------------------
# Stage 7: Start of line anchors (^)
# -------------------------------

run_test "log" "^log" yes "Matches 'log' at start of string"
run_test "slog" "^log" no "Does not match when 'log' is not at the start"
run_test "log file" "^log" yes "Matches when input starts with 'log'"
run_test "the log file" "^log" no "Does not match when 'log' is not at the start"

# -------------------------------
# Stage 8: End of Line anchors ($)
# -------------------------------

run_test "dog" "dog$" yes "Matches 'dog' at end of string"
run_test "dogs" "dog$" no "Should not match when 'dog' is followed by more characters"
run_test "my dog" "dog$" yes "Matches when 'dog' is the last word"
run_test "dog pound" "dog$" no "Should not match when 'dog' is not at the end"
run_test "bulldog" "dog$" yes "Matches if string ends with 'dog'"
run_test "bulldogs" "dog$" no "Fails if extra character after 'dog'"

# -------------------------------
# Stage 9: One or more repetitions (+)
# -------------------------------

# === Literal character repetition ===
run_test "a" "a+" yes "Single 'a' matches a+"
run_test "aa" "a+" yes "Multiple 'a's match a+"
run_test "dog" "a+" no "No 'a' in 'dog' — should not match"
run_test "" "a+" no "Empty string should not match"

# === Embedded usage in literal patterns ===
run_test "cats" "ca+ts" yes "'cats' matches ca+ts"
run_test "caats" "ca+ts" yes "'caats' matches ca+ts"
run_test "caaaats" "ca+ts" yes "'caaaats' matches ca+ts"
run_test "cts" "ca+ts" no "Missing 'a's — should not match"
run_test "cbts" "ca+ts" no "Wrong letter in place of 'a' — should not match"

# === Using multiple + quantifiers ===
run_test "zzz" "z+z" yes "'zzz' matches z+z"
run_test "zz" "z+z" yes "'zz' matches z+z"
run_test "z" "z+z" no "'z' does not satisfy z+z"

# === \d+ and \w+ (character classes + +)
run_test "123" "\d+" yes "Digit sequence matches \\d+"
run_test "9" "\d+" yes "Single digit matches \\d+"
run_test "abc" "\d+" no "Letters do not match \\d+"
run_test "" "\d+" no "Empty input should not match \\d+"

run_test "hello" "\w+" yes "Word characters match \\w+"
run_test "he110" "\w+" yes "Alphanumeric match for \\w+"
run_test "_" "\w+" yes "Underscore is \\w — should match"
run_test "--" "\w+" no "Symbols are not \\w — should not match"
run_test "" "\w+" no "Empty input should not match \\w+"

# === Edge cases ===
run_test "aaaa" "a+a+" yes "'aaaa' matches a+a+ (greedy overlap okay)"
run_test "aa" "a+a+" yes "'aa' matches a+a+"
run_test "a" "a+a+" no "'a' not enough to satisfy both a+"
run_test "apple" "a+p+" yes "Multiple a’s and at least one p — should match"
run_test "appple" "a+p+" yes "More than one 'p' — still match"
run_test "ale" "a+p+" no "Missing required p — should not match"

# -------------------------------
# Stage 9: One or more repetitions (+)
# -------------------------------

# === Literal optional match ===
run_test "dogs" "dogs?" yes "'dogs' matches dogs?"
run_test "dog" "dogs?" yes "'dog' matches dogs?"
run_test "dogss" "dogs?" no "'dogss' should not match dogs?"
run_test "cats" "dogs?" no "'cats' should not match dogs?"

# === Single character optional ===
run_test "" "a?" yes "Empty input matches a?"
run_test "a" "a?" yes "Single 'a' matches a?"
run_test "aa" "a?" no "Double 'a' should not match a?"

# === Class + ? ===
run_test "7" "\d?" yes "Single digit matches \\d?"
run_test "" "\d?" yes "Empty input matches optional digit"
run_test "99" "\d?" no "Multiple digits should not match \\d?"

run_test "x" "\w?" yes "Single word character matches \\w?"
run_test "" "\w?" yes "Empty input matches \\w?"
run_test "--" "\w?" no "Symbols should not match \\w?"

# === Optional in longer pattern ===
run_test "logs" "log?s" yes "'logs' matches log?s"
run_test "los" "log?s" no "Missing 'g' — should not match"
run_test "log" "log?s" no "Missing 's' at end — should not match"
run_test "logs" "log?s?" yes "Both optional — should match 'logs'"
run_test "log" "log?s?" yes "Missing s — still matches"
run_test "lo" "log?s?" no "Missing g — doesn't match"

echo "✅ All tests completed."
