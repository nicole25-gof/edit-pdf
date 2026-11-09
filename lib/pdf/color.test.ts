import { describe, expect, it } from "vitest";
import { hexToRgb } from "./color";

describe("hexToRgb", () => {
  it("converts 6-digit hex to 0–1 rgb", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 1, g: 0, b: 0 });
    expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 1, b: 0 });
  });

  it("expands 3-digit hex", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 1, g: 1, b: 1 });
  });
});
