const CSS_WIDE_KEYWORDS = new Set([
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

/** A raw inline CSS value without a trailing `!important`. */
export function withoutImportant(value: string): string {
  return value.replace(/!\s*important\s*$/i, "").trim();
}

/**
 * The value a style select binds: "" (its placeholder) for no value. TipTap
 * keeps raw inline values, so a CSS-wide keyword or a blank value counts as
 * none.
 */
export function selectValue(value: string | undefined): string {
  if (!value) return "";
  const bare = withoutImportant(value);
  return bare === "" || CSS_WIDE_KEYWORDS.has(bare.toLowerCase()) ? "" : value;
}
