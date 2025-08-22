// parser.test.ts
import { tokenize } from "../app/tokenizer";
import { Parser } from "../app/parser";
import type { ASTNode } from "../app/types";

function testParser(pattern: string) {
  console.log(`\nPattern: ${pattern}`);
  const tokens = tokenize(pattern);
  console.log("Tokens:", tokens);

  const parser = new Parser(tokens);
  const ast: ASTNode = parser.parseExpression();
  console.log("AST:", JSON.stringify(ast, null, 2));
}

// Example test cases
testParser("^abc$");
testParser("a|b");
testParser("a+");
testParser("\\d\\w*");
testParser("[abc]");
testParser("[^xyz]");
testParser("(ab|cd)*");
// Range quantifier tests
testParser("a{2}"); // exact repeat
testParser("a{2,4}"); // bounded range
testParser("a{3,}"); // open upper bound
testParser("ab{5}c"); // range inside concatenation
testParser("^a{1,2}b$"); // range with anchors
testParser("x{10,20}y"); // multi-digit range
testParser("z{7,}"); // open upper bound, multi-digit
