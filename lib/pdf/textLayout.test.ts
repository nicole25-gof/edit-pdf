import { describe, expect, it } from "vitest";
import { alignedX } from "./textLayout";

const font = {
  widthOfTextAtSize: (text: string, size: number) => text.length * size * 0.5,
};

describe("alignedX", () => {
  it("keeps left alignment at box origin", () => {
    expect(alignedX("Hi", font as never, 10, 40, 100, "left")).toBe(40);
  });

  it("centers and right-aligns within the box", () => {
    expect(alignedX("Hi", font as never, 10, 40, 100, "center")).toBe(85);
    expect(alignedX("Hi", font as never, 10, 40, 100, "right")).toBe(130);
  });
});
