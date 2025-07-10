const args = process.argv;
// const pattern = "a+a";
const pattern = args[3];

// const inputLine: string = "aaa";
const inputLine: string = await Bun.stdin.text();

function matchPattern(inputLine: string, pattern: string): boolean {
  if (
    !pattern.includes("\\") &&
    !pattern.includes("[") &&
    !pattern.includes("^") &&
    !pattern.includes("$") &&
    !pattern.includes("+") &&
    !pattern.includes("]")
  ) {
    return inputLine.includes(pattern);
  }

  const tokens = pattern.split(" ");
  const inputTokens = inputLine.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const inputToken = inputTokens[i];
    // if (token.startsWith("\\d") && token.length > 2) {
    //   let digitCount = 0;
    //   for (let j = 0; j < token.length - 1; j++) {
    //     if (token[j] === "\\" && token[j + 1] === "d") {
    //       digitCount++;
    //       j++;
    //     }
    //   }
    //   if (!exactDigits(inputToken, digitCount)) {
    //     return false;
    //   }
    // }
    if (token.startsWith("^")) {
      return inputLine.startsWith(token.slice(1));
    } else if (token.endsWith("$")) {
      return inputLine.endsWith(token.slice(0, -1));
    } else if (token == "\\d") {
      if (!isNumber(inputToken)) return false;
    } else if (token === "\\w") {
      if (!isWord(inputToken)) {
        return false;
      }
    } else if (
      (token.includes("\\d") || token.includes("\\w") || token.includes("+")) &&
      token.length > 1
    ) {
      console.log(inputToken, token);
      if (!matchSequence(inputToken, token)) {
        return false;
      }
    } else if (token.startsWith("[^") && token.endsWith("]")) {
      if (!Array.from(inputToken).some((c) => !token.slice(2, -1).includes(c)))
        return false;
    } else if (token.startsWith("[") && token.endsWith("]")) {
      if (!Array.from(inputToken).some((c) => token.slice(1, -1).includes(c)))
        return false;
    } else {
      if (!inputToken.includes(token)) {
        return false;
      }
    }
  }
  return true;
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.error("Logs from your program will appear here!");
function isNumber(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const charCode = token.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
  }
  return false;
}
function patternTokenizer(pattern: string): string[] {
  const tokens: string[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    // 🔹 Handle escape + quantifier (e.g., \w+ or \d+)
    if (char === "\\" && i + 2 < pattern.length && pattern[i + 2] === "+") {
      tokens.push(pattern[i] + pattern[i + 1] + pattern[i + 2]); // e.g., '\w+'
      i += 2;
    }

    // 🔹 Handle escape without quantifier (e.g., \w)
    else if (char === "\\" && i + 1 < pattern.length) {
      tokens.push(pattern[i] + pattern[i + 1]); // e.g., '\w'
      i += 1;
    }

    // 🔹 Handle single char + '+' quantifier (e.g., a+)
    else if (i + 1 < pattern.length && pattern[i + 1] === "+") {
      tokens.push(pattern[i] + pattern[i + 1]); // e.g., 'a+'
      i += 1;
    }

    // 🔹 Handle normal characters
    else {
      tokens.push(char);
    }
  }
  return tokens;
}

// function patternTokenizer(pattern: string): string[] {
//   const tokens: string[] = [];
//   for (let i = 0; i < pattern.length; i++) {
//     if (
//       (pattern[i] == "\\" && pattern.length > i + 1) ||
//       (pattern.length > i + 1 && pattern[i + 1] == "+")
//     ) {
//       tokens.push(pattern[i] + pattern[i + 1]);
//       i += 1;
//     } else {
//       tokens.push(pattern[i]);
//     }
//   }
//   return tokens;
// }

function matchesTokens(input: string, token: string): boolean {
  if (input === undefined || input.length === 0) {
    return false;
  }
  const code = input.charCodeAt(0);
  if (token === "\\d") {
    return code >= 48 && code <= 57;
  } else if (token === "\\w") {
    return (
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      code === 95
    );
  } else if (token.endsWith("+")) {
  }
  return input === token;
}
function matchSequence(input: string, pattern: string): boolean {
  const tokens = patternTokenizer(pattern);

  for (let start = 0; start <= input.length; start++) {
    if (tryMatch(start, 0)) {
      return true;
    }
  }

  return false;

  function tryMatch(inputIndex: number, tokenIndex: number): boolean {
    if (tokenIndex === tokens.length) {
      return true;
    }

    const token = tokens[tokenIndex];

    if (token.endsWith("+")) {
      const base = token.slice(0, -1);
      let count = 0;

      while (
        inputIndex + count < input.length &&
        matchesTokens(input[inputIndex + count], base)
      ) {
        count++;
      }

      if (count === 0) return false;

      for (let k = count; k >= 1; k--) {
        if (tryMatch(inputIndex + k, tokenIndex + 1)) {
          return true;
        }
      }

      return false;
    } else {
      if (
        inputIndex < input.length &&
        matchesTokens(input[inputIndex], token)
      ) {
        return tryMatch(inputIndex + 1, tokenIndex + 1);
      } else {
        return false;
      }
    }
  }
}

// function matchSequence(input: string, patttern: string): boolean {
//   const tokens = patternTokenizer(patttern);
//   let x = 0;
//   console.log(input, tokens);
//   console.log("entered match sequence");
//   // if (tokens.length !== input.length) {
//   //   return false;
//   // }
//   for (let i = 0; i < tokens.length; i++) {
//     if (tokens[i].endsWith("+")) {
//       const token = tokens[i].slice(0, -1);
//       if (input[i] !== token) {
//         console.log("no match");
//         return false;
//       }
//       while (
//         i + x < input.length &&
//         i + 1 + x < input.length &&
//         input[i + x] === input[i + 1 + x]
//       ) {
//         x++;
//       }
//       // while (i < tokens.length - 1 && input[i + x] === input[i + 1 + x]) {
//       //    x++;
//       //  }
//     } else if (!matchesTokens(input[i + x], tokens[i])) {
//       console.log("no match");
//       return false;
//     }
//   }
//   return true;
// }
function exactDigits(input: string, count: number): boolean {
  if (input.length !== count) {
    return false;
  }
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57) {
      return false;
    }
  }
  return true;
}

function isWord(token: string): boolean {
  if (token.length === 0) {
    return false;
  } else {
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i);
      if (
        !(charCode >= 48 && charCode <= 57) &&
        !(charCode >= 65 && charCode <= 90) &&
        !(charCode >= 97 && charCode <= 122) &&
        !(charCode === 95)
      ) {
        return false;
      }
    }
    return true;
  }
}

if (matchPattern(inputLine, pattern)) {
  console.log("sheesh");
  process.exit(0);
} else {
  console.log("oof");
  process.exit(1);
}
