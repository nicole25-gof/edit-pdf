import { describe, expect, it } from "vitest";
import { editedFileName } from "./exportName";

describe("editedFileName", () => {
  it("appends -edited before the extension", () => {
    expect(editedFileName("report.pdf")).toBe("report-edited.pdf");
    expect(editedFileName("Report.PDF")).toBe("Report-edited.pdf");
  });

  it("adds .pdf when the original has no extension", () => {
    expect(editedFileName("notes")).toBe("notes-edited.pdf");
  });
});
