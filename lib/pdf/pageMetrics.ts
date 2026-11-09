import type { PageSize } from "./types";

export interface PdfPoint {
  x: number;
  y: number;
}

export interface PdfRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CssPoint {
  x: number;
  y: number;
}

export interface CssRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function pageCssScale(page: PageSize, cssWidth: number): number {
  return cssWidth / page.width;
}

export function pdfToCss(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  scale: number,
  viewRotation = 0,
): CssPoint {
  const rotated = rotatePdfPoint(x, y, pageWidth, pageHeight, viewRotation);
  return {
    x: rotated.x * scale,
    y: (rotated.pageHeight - rotated.y) * scale,
  };
}

export function cssToPdf(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  scale: number,
  viewRotation = 0,
): PdfPoint {
  const unrotated = unrotatePdfPoint(
    x / scale,
    pageHeightAfterRotation(pageWidth, pageHeight, viewRotation) - y / scale,
    pageWidth,
    pageHeight,
    viewRotation,
  );
  return unrotated;
}

export function pdfRectToCss(
  rect: PdfRect,
  pageWidth: number,
  pageHeight: number,
  scale: number,
  viewRotation = 0,
): CssRect {
  const corners = [
    pdfToCss(rect.x, rect.y, pageWidth, pageHeight, scale, viewRotation),
    pdfToCss(rect.x + rect.width, rect.y, pageWidth, pageHeight, scale, viewRotation),
    pdfToCss(rect.x, rect.y + rect.height, pageWidth, pageHeight, scale, viewRotation),
    pdfToCss(
      rect.x + rect.width,
      rect.y + rect.height,
      pageWidth,
      pageHeight,
      scale,
      viewRotation,
    ),
  ];
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    x: left,
    y: top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  };
}

export function cssRectToPdf(
  rect: CssRect,
  pageWidth: number,
  pageHeight: number,
  scale: number,
  viewRotation = 0,
): PdfRect {
  const corners = [
    cssToPdf(rect.x, rect.y, pageWidth, pageHeight, scale, viewRotation),
    cssToPdf(rect.x + rect.width, rect.y, pageWidth, pageHeight, scale, viewRotation),
    cssToPdf(rect.x, rect.y + rect.height, pageWidth, pageHeight, scale, viewRotation),
    cssToPdf(
      rect.x + rect.width,
      rect.y + rect.height,
      pageWidth,
      pageHeight,
      scale,
      viewRotation,
    ),
  ];
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const left = Math.min(...xs);
  const bottom = Math.min(...ys);
  return {
    x: left,
    y: bottom,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - bottom,
  };
}

function rotatePdfPoint(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  viewRotation: number,
): { x: number; y: number; pageHeight: number } {
  const turns = normalizeTurns(viewRotation);
  if (turns === 0) {
    return { x, y, pageHeight };
  }
  if (turns === 1) {
    return { x: y, y: pageWidth - x, pageHeight: pageWidth };
  }
  if (turns === 2) {
    return { x: pageWidth - x, y: pageHeight - y, pageHeight };
  }
  return { x: pageHeight - y, y: x, pageHeight: pageWidth };
}

function unrotatePdfPoint(
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  viewRotation: number,
): PdfPoint {
  const turns = normalizeTurns(viewRotation);
  if (turns === 0) {
    return { x, y };
  }
  if (turns === 1) {
    return { x: pageWidth - y, y: x };
  }
  if (turns === 2) {
    return { x: pageWidth - x, y: pageHeight - y };
  }
  return { x: y, y: pageHeight - x };
}

function pageHeightAfterRotation(
  pageWidth: number,
  pageHeight: number,
  viewRotation: number,
): number {
  const turns = normalizeTurns(viewRotation);
  return turns % 2 === 0 ? pageHeight : pageWidth;
}

function normalizeTurns(viewRotation: number): number {
  const deg = ((viewRotation % 360) + 360) % 360;
  return Math.round(deg / 90) % 4;
}
