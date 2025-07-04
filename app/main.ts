const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  }

  if (pattern === "\\w") {
    return Array.from(inputLine).some((c) => {
      var code = c.charCodeAt(0);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) && // lower alpha (a-z)
        !(code == 95)
      )
        return false;
      else return true;
    });
  } else if (pattern === "\\d") {
    return Array.from(inputLine).some((c) => "0123456789".includes(c));
  } else if (pattern.startsWith("[^") && pattern.endsWith("]")) {
    return Array.from(inputLine).some((c) => !pattern.slice(2, -1).includes(c));
  } else if (pattern.startsWith("[") && pattern.endsWith("]")) {
    return Array.from(inputLine).some((c) => pattern.slice(1, -1).includes(c));
  } else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.error("Logs from your program will appear here!");

if (matchPattern(inputLine, pattern)) {
  console.log("sheesh");
  process.exit(0);
} else {
  console.log("oof");
  process.exit(1);
}
