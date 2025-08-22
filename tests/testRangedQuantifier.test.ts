// test-range-quantifiers.ts
import { tokenize } from "../app/tokenizer";

function runTest(pattern: string) {
  const tokens = tokenize(pattern);
  console.log(`Pattern: ${pattern}`);
  console.log("Tokens:", JSON.stringify(tokens, null, 2));
  console.log("----");
}

// ✅ Test cases for range quantifiers
const patterns = [
  "a{2}",
  "a{2,4}",
  "a{3,}",
  "ab{5}c",
  "^a{1,2}b$",
  "x{10,20}y",
  "z{7,}",
];

for (const p of patterns) {
  runTest(p);
}
