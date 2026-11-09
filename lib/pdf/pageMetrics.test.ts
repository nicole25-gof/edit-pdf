import { describe, expect, it } from "vitest";
import { cssToPdf, cssRectToPdf, pdfRectToCss, pdfToCss } from "./pageMetrics";

const PAGE = { width: 595.28, height: 841.89 };
const SCALE = 1.2;

describe("pageMetrics", () => {
  it("round-trips a PDF point through CSS within 1pt", () => {
    const original = { x: 120.4, y: 400.2 };
    const css = pdfToCss(original.x, original.y, PAGE.width, PAGE.height, SCALE);
    const back = cssToPdf(css.x, css.y, PAGE.width, PAGE.height, SCALE);
    expect(Math.abs(back.x - original.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.y - original.y)).toBeLessThanOrEqual(1);
  });

  it("round-trips a PDF rect through CSS within 1pt", () => {
    const original = { x: 80, y: 200, width: 160, height: 40 };
    const css = pdfRectToCss(original, PAGE.width, PAGE.height, SCALE);
    const back = cssRectToPdf(css, PAGE.width, PAGE.height, SCALE);
    expect(Math.abs(back.x - original.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.y - original.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.width - original.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.height - original.height)).toBeLessThanOrEqual(1);
  });

  it("maps PDF origin bottom-left to CSS origin top-left", () => {
    const css = pdfToCss(0, 0, PAGE.width, PAGE.height, 1);
    expect(css.x).toBeCloseTo(0);
    expect(css.y).toBeCloseTo(PAGE.height);
  });
});
