import { describe, expect, it } from "vitest";
import { selectValue, withoutImportant } from "../src/utils/cssValue";

describe("selectValue", () => {
  it("binds CSS-wide keywords and blank values as the placeholder", () => {
    for (const value of [
      undefined,
      "",
      "  ",
      "inherit",
      "INITIAL",
      "revert-layer",
      "Unset !important",
    ]) {
      expect(selectValue(value)).toBe("");
    }
  });

  it("binds any other value unchanged", () => {
    expect(selectValue("Georgia, serif")).toBe("Georgia, serif");
    expect(selectValue("15px !important")).toBe("15px !important");
    expect(selectValue("normal")).toBe("normal");
  });
});

describe("withoutImportant", () => {
  it("strips a trailing !important, with or without a space", () => {
    expect(withoutImportant("15px !important")).toBe("15px");
    expect(withoutImportant("15px ! IMPORTANT ")).toBe("15px");
    expect(withoutImportant("15px")).toBe("15px");
  });
});
