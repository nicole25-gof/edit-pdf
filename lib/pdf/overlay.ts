export type OverlayType = "text" | "image" | "signature" | "highlight";

export type FontFamily = "NotoSansSC" | "NotoSerifSC" | "Helvetica";
export type TextAlign = "left" | "center" | "right";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverlayBase {
  id: string;
  type: OverlayType;
  pageIndex: number;
  rect: Rect;
}

export interface TextBox extends OverlayBase {
  type: "text";
  content: string;
  fontFamily: FontFamily;
  fontSize: number;
  color: string;
  align: TextAlign;
}

export type OverlayObject = TextBox;

export const PHASE1_FONTS: { id: FontFamily; label: string }[] = [
  { id: "NotoSansSC", label: "Noto Sans SC" },
  { id: "NotoSerifSC", label: "Noto Serif SC" },
  { id: "Helvetica", label: "Helvetica" },
];

export const DEFAULT_TEXT_BOX: Pick<
  TextBox,
  "content" | "fontFamily" | "fontSize" | "color" | "align"
> = {
  content: "",
  fontFamily: "NotoSansSC",
  fontSize: 14,
  color: "#1c1917",
  align: "left",
};

export const DEFAULT_TEXT_BOX_SIZE = { width: 180, height: 36 };

export function createTextBox(
  pageIndex: number,
  point: { x: number; y: number },
  id = crypto.randomUUID(),
): TextBox {
  return {
    id,
    type: "text",
    pageIndex,
    rect: {
      x: point.x,
      y: point.y - DEFAULT_TEXT_BOX_SIZE.height,
      width: DEFAULT_TEXT_BOX_SIZE.width,
      height: DEFAULT_TEXT_BOX_SIZE.height,
    },
    ...DEFAULT_TEXT_BOX,
  };
}

export function clampRectToPage(
  rect: Rect,
  pageWidth: number,
  pageHeight: number,
): Rect {
  const width = Math.min(Math.max(24, rect.width), pageWidth);
  const height = Math.min(Math.max(18, rect.height), pageHeight);
  const x = Math.min(Math.max(0, rect.x), Math.max(0, pageWidth - width));
  const y = Math.min(Math.max(0, rect.y), Math.max(0, pageHeight - height));
  return { x, y, width, height };
}

export function fontCssFamily(font: FontFamily): string {
  if (font === "NotoSerifSC") {
    return '"Noto Serif SC", "Source Han Serif SC", serif';
  }
  if (font === "Helvetica") {
    return "Helvetica, Arial, sans-serif";
  }
  return '"Noto Sans SC", "Source Han Sans SC", sans-serif';
}
