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
