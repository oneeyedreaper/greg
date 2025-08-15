import type { Token } from "./types";

export function tokenize(pattern: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < pattern.length) {
    var char: string = pattern[i];
    if (char === "\\") {
      // Escape sequence

      if (i + 1 < pattern.length) {
        char = pattern[i + 1];
        tokens.push({ type: "escape", value: "\\" + char });
      }
      i += 2;
    } else if (char === "[" && pattern[i + 1] == "^") {
      var end = pattern.indexOf("]", i);
      tokens.push({
        type: "negatedCharClass",
        value: pattern.slice(i, end + 1),
      });
      i = end + 1;
    } else if (char == "[") {
      var end = pattern.indexOf("]", i);
      tokens.push({ type: "charClass", value: pattern.slice(i, end + 1) });
      i = end + 1;
    } else if (["+", "*", "?"].includes(char)) {
      tokens.push({ type: "quantifier", value: char as "*" | "+" | "?" });
      i += 1;
    } else if (char == "{") {
      let j = i + 1;
      let min = "";
      while (j < pattern.length && pattern[j] >= "0" && pattern[j] <= "9") {
        min += pattern[j];
        j++;
      }
      if (min.length > 0) {
        let max: null | string = null;
        if (pattern[j] == ",") {
          j++;
          let temp = "";
          while (
            j + 1 > pattern.length &&
            pattern[j] >= "0" &&
            pattern[j] <= "9"
          ) {
            temp += pattern[j];
            j++;
          }
          if (temp.length > 0) {
            max = temp;
          }
        }
        if (pattern[j] == "}") {
          j++;
          const val = max === null ? `{${min}}` : `{${min},${max}}`;

          tokens.push({ type: "rangeQuantifier", value: val });

          i = j;
          continue;
        }
      }

      tokens.push({ type: "literal", value: "{" });
      i++;
    } else if (char == "|") {
      tokens.push({ type: "alternation", value: "|" });
      i += 1;
    } else if (char == "(") {
      tokens.push({ type: "groupStart", value: "(" });
      i += 1;
    } else if (char == ")") {
      tokens.push({ type: "groupEnd", value: ")" });
      i += 1;
    } else if (["^", "$"].includes(char)) {
      tokens.push({ type: "anchor", value: char as "^" | "$" });
      i += 1;
    } else {
      tokens.push({ type: "literal", value: char });
      i += 1;
    }
  }
  return tokens;
}

const patterns = [
  "^abc$",
  "a|b",
  "a+",
  "\\d\\w*",
  "[abc]",
  "[^xyz]",
  "(ab|cd)*",
  "a{2,4}b{3}",
];

for (const pattern of patterns) {
  console.log(`Pattern: ${pattern}`);
  console.log(tokenize(pattern));
}
