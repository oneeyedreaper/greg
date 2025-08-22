import type {
  Token,
  LiteralNode,
  ConcatNode,
  AlternationNode,
  StarNode,
  PlusNode,
  OptionalNode,
  RangeQuantifierNode,
  GroupNode,
  CharClassNode,
  NegatedCharClassNode,
  AnchorNode,
  EscapeNode,
  ASTNode,
} from "./types";

export class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  //Helpers

  private peek(): Token | null {
    return this.tokens[this.pos] ?? null;
  }

  private advance(): Token | null {
    return this.tokens[this.pos++]!;
  }
  private check(type: Token["type"]): boolean {
    return this.peek() !== null && this.peek()!.type === type;
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  // Main Parsing Methods

  private parseRangeQuantifier(value: string): {
    min: number;
    max: number | null;
  } {
    if (value[0] !== "{" && value[value.length - 1] !== "}") {
      throw new Error("Invalid range quantifier format: " + value);
    }
    const inner = value.slice(1, -1);
    let i = 0;
    let minstr = "";
    while (i < inner.length && this.isDigit(inner[i])) {
      minstr += inner[i];
      i++;
    }
    if (minstr.length === 0) {
      throw new Error("Invalid range quantifier format: " + value);
    }
    //base 10
    const min = parseInt(minstr, 10);

    let max: number | null = null;

    if (i < inner.length && inner[i] == ",") {
      i++;

      let maxstr = "";
      while (i < inner.length && this.isDigit(inner[i])) {
        maxstr += inner[i];
        i++;
      }
      if (maxstr.length === 0) {
        max = null;
        // open ended range {m,}
      } else {
        max = parseInt(maxstr, 10);
      }
    }

    if (i !== inner.length) {
      throw new Error("Invalid range quantifier format: " + value);
    }

    return { min, max };
  }

  // Enmtry Point

  public parse(): ASTNode {
    const node = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error("Unexpected token at position " + this.pos);
    }
    return node;
  }
  // Expression -> Concatenation("|",Concatenation)

  public parseExpression(): ASTNode {
    let node = this.parseConcatenation();
    while (this.check("alternation")) {
      this.advance(); // consume the alternation '|' token
      const right = this.parseConcatenation();
      node = {
        type: "alternation",
        left: node,
        right,
      } as AlternationNode;
    }
    return node;
  }

  // concatenation -> quantified+

  private parseConcatenation(): ASTNode {
    const nodes: ASTNode[] = [];
    while (
      this.peek() !== null &&
      this.peek()!.type !== "alternation" &&
      this.peek()!.type !== "groupEnd"
    ) {
      const node = this.parseQuantified();
      if (node) {
        nodes.push(node);
      }
    }
    if (nodes.length === 1) {
      return nodes[0];
    }
    return { type: "concat", children: nodes } as ConcatNode;
  }

  //quantiied-> primary quantifier*

  private parseQuantified(): ASTNode {
    let node = this.parsePrimary();
    if (this.check("quantifier")) {
      const token = this.advance()!;
      switch (token.value) {
        case "*":
          node = { type: "star", child: node } as StarNode;
          break;
        case "+":
          node = { type: "plus", child: node } as PlusNode;
          break;
        case "?":
          node = { type: "optional", child: node } as OptionalNode;
          break;

        default: {
          throw new Error("Invalid quantifier: " + token.value);
        }
      }
    } else if (this.check("rangeQuantifier")) {
      const token = this.advance()!;
      const { min, max } = this.parseRangeQuantifier(token.value);
      node = {
        type: "rangeQuantifier",
        child: node,
        min,
        max,
      } as RangeQuantifierNode;
    }
    return node;
  }

  // Primary -> literal | charClass | negatedCharClass | group | anchor | escape

  private parsePrimary(): ASTNode {
    const token = this.advance();
    if (!token) throw new Error("Unexpected end of input");
    switch (token.type) {
      case "literal":
        return { type: "literal", value: token.value } as LiteralNode;
      case "charClass":
        return {
          type: "charClass",
          chars: token.value.slice(1, -1).split(""),
        } as CharClassNode;
      case "negatedCharClass":
        return {
          type: "negatedCharClass",
          chars: token.value.slice(2, -1).split(""),
        } as NegatedCharClassNode;
      case "anchor":
        return { type: "anchor", kind: token.value } as AnchorNode;
      case "escape":
        return { type: "escape", kind: token.value } as EscapeNode;

      case "groupStart": {
        let node = this.parseExpression();
        if (!this.check("groupEnd")) {
          throw new Error("Expected group end token");
        }
        this.advance(); // consume the group end ")" token
        return { type: "group", children: [node] } as GroupNode;
      }
      default:
        throw new Error("Unexpected token: " + token.type);
    }
  }
}
