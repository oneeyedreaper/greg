//mhchen github
const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

type Transition = {
  nextState: State;
} & (
  | {
      char: string;
    }
  | {
      negativeChars: string[];
    }
);

const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => d.toString());

function generateLetterRange(begin: string, end: string) {
  const beginCharCode = begin.charCodeAt(0);
  const endCharCode = end.charCodeAt(0);
  const letters: string[] = [];

  for (let i = beginCharCode; i <= endCharCode; i++) {
    letters.push(String.fromCharCode(i));
  }
  return letters;
}

class State {
  private transitions: Transition[] = [];

  addTransition(char: string, nextState: State) {
    this.transitions.push({
      char,
      nextState,
    });
  }

  addNegativeTransition(negativeChars: string[], nextState: State) {
    this.transitions.push({
      negativeChars,
      nextState,
    });
  }

  match(string: string, i: number, shouldMatchEnd: boolean): boolean {
    if (
      this.transitions.length === 0 &&
      (!shouldMatchEnd || i === string.length)
    ) {
      return true;
    }

    const char = string[i];

    if (char == null) {
      return false;
    }

    const validTransitions = this.transitions.filter((transition) => {
      if ("negativeChars" in transition) {
        return !transition.negativeChars.includes(char);
      } else {
        return transition.char === char;
      }
    });

    const nextIndex = i + 1;

    return validTransitions.some((transition) => {
      return transition.nextState.match(string, nextIndex, shouldMatchEnd);
    });
  }
}

class StateMachine {
  private stateTreeRoot: State = new State();
  private shouldMatchStart: boolean;
  private shouldMatchEnd: boolean;

  constructor(shouldMatchStart: boolean, shouldMatchEnd: boolean) {
    this.shouldMatchStart = shouldMatchStart;
    this.shouldMatchEnd = shouldMatchEnd;
  }

  getRoot() {
    return this.stateTreeRoot;
  }

  static build(regexString: string) {
    const shouldMatchStart = regexString.startsWith("^");
    const shouldMatchEnd = regexString.endsWith("$");

    const stateMachine = new StateMachine(shouldMatchStart, shouldMatchEnd);
    let currentState = stateMachine.getRoot();

    let i = shouldMatchStart ? 1 : 0;
    let end = shouldMatchEnd ? regexString.length - 1 : regexString.length;

    while (i < end) {
      const char = regexString[i];

      const nextState = new State();
      if (char === "\\") {
        const nextChar = regexString[i + 1];
        switch (nextChar) {
          case "d": {
            for (const char of ALL_DIGITS) {
              currentState.addTransition(char, nextState);
            }
            break;
          }
          case "w": {
            const allChars = [
              ...ALL_DIGITS,
              ...generateLetterRange("a", "z"),
              ...generateLetterRange("A", "Z"),
            ];

            for (const char of allChars) {
              currentState.addTransition(char, nextState);
            }
            break;
          }
          default: {
            throw new Error(
              `Escape sequence not implemented: ${`\\${nextChar}`} `,
            );
          }
        }
        i += 2;
      } else if (char === "[") {
        const endIndex = regexString.indexOf("]", i);

        if (regexString[i + 1] === "^") {
          currentState.addNegativeTransition(
            regexString.slice(i + 2, endIndex).split(""),
            nextState,
          );
        } else {
          for (let j = i + 1; j < endIndex; j++) {
            currentState.addTransition(regexString[j], nextState);
          }
        }
        i += endIndex + 1;
      } else {
        currentState.addTransition(char, nextState);
        i++;

        const nextChar = regexString[i];
        if (nextChar === "+") {
          nextState.addTransition(char, nextState);
          i++;
        }
      }
      currentState = nextState;
    }
    return stateMachine;
  }

  match(string: string) {
    for (let i = 0; i < string.length; i++) {
      const isMatch = this.stateTreeRoot.match(string, i, this.shouldMatchEnd);
      if (isMatch) {
        console.log("returning true");
        return true;
      }
      if (this.shouldMatchStart) {
        break;
      }
    }
    return false;
  }
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const stateMachine = StateMachine.build(pattern);
if (stateMachine.match(inputLine)) {
  process.exit(0);
} else {
  process.exit(1);
}

export {};
