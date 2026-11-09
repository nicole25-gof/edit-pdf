import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { hexToRgb } from "./color";
import type { FontFamily, OverlayObject, TextBox } from "./overlay";
import { alignedX, wrapText } from "./textLayout";

const FONT_URLS: Record<Exclude<FontFamily, "Helvetica">, string> = {
  NotoSansSC: "/fonts/NotoSansSC-Regular.otf",
  NotoSerifSC: "/fonts/NotoSerifSC-Regular.otf",
};

const fontCache = new Map<string, ArrayBuffer>();

export async function bakeOverlays(
  source: Uint8Array,
  overlays: OverlayObject[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(source);
  pdf.registerFontkit(fontkit);

  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const customFonts = new Map<Exclude<FontFamily, "Helvetica">, PDFFont>();

  const needed = new Set<Exclude<FontFamily, "Helvetica">>();
  for (const overlay of overlays) {
    if (overlay.type !== "text") {
      continue;
    }
    if (overlay.fontFamily !== "Helvetica") {
      needed.add(overlay.fontFamily);
    } else if (/[^\u0000-\u00ff]/.test(overlay.content)) {
      needed.add("NotoSansSC");
    }
  }

  for (const family of needed) {
    const bytes = await loadFontBytes(family);
    customFonts.set(family, await pdf.embedFont(bytes, { subset: true }));
  }

  for (const overlay of overlays) {
    if (overlay.type !== "text") {
      continue;
    }
    const pages = pdf.getPages();
    const page = pages[overlay.pageIndex];
    if (!page) {
      continue;
    }
    drawTextBox(page, overlay, helvetica, customFonts);
  }

  return pdf.save();
}

function drawTextBox(
  page: PDFPage,
  box: TextBox,
  helvetica: PDFFont,
  customFonts: Map<Exclude<FontFamily, "Helvetica">, PDFFont>,
) {
  const content = box.content;
  if (!content.trim()) {
    return;
  }
  const font =
    box.fontFamily === "Helvetica" && !/[^\u0000-\u00ff]/.test(box.content)
      ? helvetica
      : (customFonts.get(
          box.fontFamily === "Helvetica" ? "NotoSansSC" : box.fontFamily,
        ) ?? helvetica);
  const color = hexToRgb(box.color);
  const size = box.fontSize;
  const lineHeight = size * 1.3;
  const lines = wrapText(content, font, size, box.rect.width);
  let y = box.rect.y + box.rect.height - size;
  const minY = box.rect.y;

  for (const line of lines) {
    if (y < minY) {
      break;
    }
    page.drawText(line, {
      x: alignedX(line, font, size, box.rect.x, box.rect.width, box.align),
      y,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    y -= lineHeight;
  }
}

async function loadFontBytes(family: Exclude<FontFamily, "Helvetica">) {
  const cached = fontCache.get(family);
  if (cached) {
    return cached;
  }
  const response = await fetch(FONT_URLS[family]);
  if (!response.ok) {
    throw new Error(`无法加载字体 ${family}`);
  }
  const buffer = await response.arrayBuffer();
  fontCache.set(family, buffer);
  return buffer;
}

export function triggerDownload(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
