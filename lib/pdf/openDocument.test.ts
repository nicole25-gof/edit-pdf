import { describe, expect, it } from "vitest";
import { isPdfFile } from "./openDocument";

function file(name: string, type: string) {
  return new File(["x"], name, { type });
}

describe("isPdfFile via openDocument", () => {
  it("accepts pdf mime or extension", () => {
    expect(isPdfFile(file("a.pdf", "application/pdf"))).toBe(true);
    expect(isPdfFile(file("a.PDF", ""))).toBe(true);
  });

  it("rejects other types", () => {
    expect(isPdfFile(file("a.txt", "text/plain"))).toBe(false);
  });
});
