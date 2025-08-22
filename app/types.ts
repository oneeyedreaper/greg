export type Token =
  | LiteralToken
  | EscapeToken
  | CharClassToken
  | NegatedCharClassToken
  | AnchorToken
  | QuantifierToken
  | RangeQuantifierToken
  | AlternationToken
  | GroupStartToken
  | GroupEndToken;

export type LiteralToken = {
  type: "literal";
  value: string;
};
export type EscapeToken = {
  type: "escape";
  value: string; // \\d, \\w, \\s, etc.
};
export type CharClassToken = {
  type: "charClass";
  value: string; // [abc], [a-z], etc.
};
export type NegatedCharClassToken = {
  type: "negatedCharClass";
  value: string; // [^abc], [^a-z], etc.
};
export type AnchorToken = {
  type: "anchor";
  value: "^" | "$"; // Start or end of line
};
export type QuantifierToken = {
  type: "quantifier";
  value: string; // *, +, ?, {n}, {n,m}, etc.
};
export type RangeQuantifierToken = {
  type: "rangeQuantifier";
  value: string; // {n,m}
};
export type AlternationToken = {
  type: "alternation";
  value: string; // |
};
export type GroupStartToken = {
  type: "groupStart";
  value: "("; // Start of a capturing group
};
export type GroupEndToken = {
  type: "groupEnd";
  value: ")"; // End of a capturing group
};

// ----------------------
// Parser AST Types
// ----------------------

export type ASTNode =
  | LiteralNode
  | ConcatNode
  | AlternationNode
  | StarNode
  | PlusNode
  | OptionalNode
  | RangeQuantifierNode
  | GroupNode
  | CharClassNode
  | NegatedCharClassNode
  | AnchorNode
  | EscapeNode;

export interface LiteralNode {
  type: "literal";
  value: string; // The literal string
}

export interface ConcatNode {
  type: "concat";
  children: ASTNode[]; // The children of the concatenation
}
export interface AlternationNode {
  type: "alternation";
  left: ASTNode; // Array of ASTNodes that are alternatives
  right: ASTNode; // The right side of the alternation
}
export interface StarNode {
  type: "star";
  child: ASTNode; // The node that can repeat zero or more times
}
export interface PlusNode {
  type: "plus";
  child: ASTNode; // The node that can repeat one or more times
}
export interface OptionalNode {
  type: "optional";
  child: ASTNode; // The node that is optional (zero or one time)
}
export interface RangeQuantifierNode {
  type: "rangeQuantifier";
  child: ASTNode; // The node that has a range quantifier
  min: number; // Minimum number of repetitions
  max: number | null; // Maximum number of repetitions (null if unbounded)
}
export interface GroupNode {
  type: "group";
  children: ASTNode[]; // The children of the group
}
export interface CharClassNode {
  type: "charClass";
  chars: string[]; // The characters in the character class
}

export interface NegatedCharClassNode {
  type: "negatedCharClass";
  chars: string[]; // The characters in the negated character class
}
export interface AnchorNode {
  type: "anchor";
  kind: "^" | "$"; // Start or end of line
}
export interface EscapeNode {
  type: "escape";
  kind: "\\d" | "\\w" | "\\s"; // The escape sequence (e.g., \d, \w, \s)
}
