import { describe, expect, it } from "vitest";
import { formatAppError, toAppError } from "./errors";

describe("toAppError", () => {
  it("uses Error message", () => {
    const error = toAppError("PARSE", "打开文件", new Error("Invalid PDF"));
    expect(error).toEqual({
      code: "PARSE",
      action: "打开文件",
      message: "Invalid PDF",
    });
  });

  it("uses string cause", () => {
    expect(toAppError("PARSE", "打开文件", "所选文件不是 PDF").message).toBe(
      "所选文件不是 PDF",
    );
  });
});

describe("formatAppError", () => {
  it("names action and cause", () => {
    expect(
      formatAppError({
        code: "PARSE",
        action: "打开文件",
        message: "所选文件不是 PDF",
      }),
    ).toBe("打开文件失败：所选文件不是 PDF");
  });
});
