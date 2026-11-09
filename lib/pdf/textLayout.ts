import type { PDFFont } from "pdf-lib";
import type { TextAlign } from "./overlay";

export function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const char of paragraph) {
      const next = current + char;
      if (current && font.widthOfTextAtSize(next, size) > maxWidth) {
        lines.push(current);
        current = char;
      } else {
        current = next;
      }
    }
    if (current) {
      lines.push(current);
    }
  }
  return lines;
}

export function alignedX(
  line: string,
  font: PDFFont,
  size: number,
  boxX: number,
  boxWidth: number,
  align: TextAlign,
): number {
  if (align === "left") {
    return boxX;
  }
  const width = font.widthOfTextAtSize(line, size);
  if (align === "center") {
    return boxX + Math.max(0, (boxWidth - width) / 2);
  }
  return boxX + Math.max(0, boxWidth - width);
}
