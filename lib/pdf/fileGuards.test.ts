import { describe, expect, it } from "vitest";
import { isPdfFile } from "./fileGuards";

function file(name: string, type: string) {
  return new File(["x"], name, { type });
}

describe("isPdfFile", () => {
  it("accepts application/pdf", () => {
    expect(isPdfFile(file("doc.pdf", "application/pdf"))).toBe(true);
  });

  it("accepts .pdf extension without mime", () => {
    expect(isPdfFile(file("Report.PDF", ""))).toBe(true);
  });

  it("rejects non-pdf files", () => {
    expect(isPdfFile(file("notes.txt", "text/plain"))).toBe(false);
    expect(isPdfFile(file("image.png", "image/png"))).toBe(false);
  });
});
