const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

function matchPattern(inputLine: string, pattern: string): boolean {
  if (
    !pattern.includes("\\") &&
    !pattern.includes("[") &&
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
    if ((token.includes("\\d") || token.includes("\\w")) && token.length > 2) {
      console.log(inputToken, token);
      if (!matchSequence(inputToken, token)) {
        return false;
      }
    } else if (token == "\\d") {
      if (!isNumber(inputToken)) return false;
    } else if (token === "\\w") {
      if (!isWord(inputToken)) {
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
    if (pattern[i] == "\\" && pattern.length > i + 1) {
      tokens.push(pattern[i] + pattern[i + 1]);
      i += 1;
    } else {
      tokens.push(pattern[i]);
    }
  }
  return tokens;
}

function matchesTokens(input: string, token: string): boolean {
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
  }
  return input === token;
}
function matchSequence(input: string, patttern: string): boolean {
  const tokens = patternTokenizer(patttern);
  console.log(input, tokens);
  console.log("entered match sequence");
  if (tokens.length !== input.length) {
    return false;
  }
  for (let i = 0; i < tokens.length; i++) {
    if (!matchesTokens(input[i], tokens[i])) {
      console.log("no match");
      return false;
    }
  }
  return true;
}
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
