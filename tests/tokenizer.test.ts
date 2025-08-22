import { tokenize } from "../app/tokenizer";

// Some test patterns
const patterns = [
  "a{2}",
  "a{2,4}",
  "a{3,}",
  "ab{5}c",
  "^a{1,2}b$",
  "x{10,20}y",
  "z{7,}",
];

for (const pattern of patterns) {
  console.log("Pattern:", pattern);
  const tokens = tokenize(pattern);
  console.log("Tokens:", JSON.stringify(tokens, null, 2));
  console.log("----");
}
