import { describe, expect, it } from "vitest";
import { clampRectToPage, createTextBox } from "./overlay";

describe("createTextBox", () => {
  it("places a default box so the click is near the top-left of the text", () => {
    const box = createTextBox(0, { x: 100, y: 400 }, "box-1");
    expect(box.id).toBe("box-1");
    expect(box.type).toBe("text");
    expect(box.pageIndex).toBe(0);
    expect(box.fontFamily).toBe("NotoSansSC");
    expect(box.rect.x).toBe(100);
    expect(box.rect.y).toBe(400 - box.rect.height);
    expect(box.content).toBe("");
  });
});

describe("clampRectToPage", () => {
  it("keeps the rect inside the page", () => {
    const clamped = clampRectToPage(
      { x: -20, y: 900, width: 400, height: 80 },
      200,
      300,
    );
    expect(clamped.x).toBe(0);
    expect(clamped.width).toBeLessThanOrEqual(200);
    expect(clamped.y + clamped.height).toBeLessThanOrEqual(300);
  });
});
