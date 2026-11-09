"use client";

import { create } from "zustand";
import { formatAppError, toAppError, type AppError } from "@/lib/pdf/errors";
import { editedFileName } from "@/lib/pdf/exportName";
import { confirmLargeFile, isPdfFile } from "@/lib/pdf/fileGuards";
import {
  clampRectToPage,
  createTextBox,
  type OverlayObject,
  type Rect,
  type TextAlign,
  type TextBox,
  type FontFamily,
} from "@/lib/pdf/overlay";
import { loadPdfFromBytes } from "@/lib/pdf/pdfjs";
import type { PageSize, PdfHandle } from "@/lib/pdf/types";

export type EditorTool = "select" | "text";

export interface OpenDocument {
  name: string;
  sourceBytes: Uint8Array;
  pageCount: number;
  pageSizes: PageSize[];
  pdf: PdfHandle;
}

export type TextBoxPatch = Partial<
  Pick<TextBox, "content" | "fontFamily" | "fontSize" | "color" | "align">
>;

interface DocumentStore {
  document: OpenDocument | null;
  overlays: OverlayObject[];
  selectedId: string | null;
  editingId: string | null;
  tool: EditorTool;
  status: "idle" | "loading" | "exporting";
  error: AppError | null;
  currentPage: number;
  openFile: (file: File) => Promise<void>;
  closeDocument: () => void;
  setCurrentPage: (page: number) => void;
  setTool: (tool: EditorTool) => void;
  addTextBox: (pageIndex: number, pdfPoint: { x: number; y: number }) => string | null;
  updateTextBox: (id: string, patch: TextBoxPatch) => void;
  updateOverlayRect: (id: string, rect: Rect) => void;
  deleteOverlay: (id: string) => void;
  selectOverlay: (id: string | null) => void;
  setEditingId: (id: string | null) => void;
  exportPdf: () => Promise<void>;
  clearError: () => void;
}

async function destroyPdf(pdf: PdfHandle | undefined) {
  if (!pdf) {
    return;
  }
  try {
    await pdf.destroy();
  } catch {
    // Ignore destroy races while replacing a document.
  }
}

function emptySession() {
  return {
    overlays: [] as OverlayObject[],
    selectedId: null as string | null,
    editingId: null as string | null,
    tool: "select" as EditorTool,
    currentPage: 1,
  };
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  document: null,
  overlays: [],
  selectedId: null,
  editingId: null,
  tool: "select",
  status: "idle",
  error: null,
  currentPage: 1,

  openFile: async (file: File) => {
    if (!isPdfFile(file)) {
      set({
        error: toAppError("PARSE", "打开文件", "所选文件不是 PDF"),
        status: "idle",
      });
      return;
    }

    if (!confirmLargeFile(file)) {
      return;
    }

    const previous = get().document;
    set({ status: "loading", error: null });

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const loaded = await loadPdfFromBytes(bytes);
      await destroyPdf(previous?.pdf);
      set({
        document: {
          name: file.name,
          sourceBytes: bytes,
          pageCount: loaded.pageCount,
          pageSizes: loaded.pageSizes,
          pdf: loaded.pdf,
        },
        ...emptySession(),
        status: "idle",
        error: null,
      });
    } catch (cause) {
      set({
        document: previous,
        status: "idle",
        error: toAppError(
          "PARSE",
          "打开文件",
          cause instanceof Error
            ? cause.message
            : "文件不是有效的 PDF，或解析器拒绝了该文件",
        ),
      });
    }
  },

  closeDocument: () => {
    const current = get().document;
    void destroyPdf(current?.pdf);
    set({
      document: null,
      status: "idle",
      error: null,
      ...emptySession(),
    });
  },

  setCurrentPage: (page: number) => {
    const count = get().document?.pageCount ?? 1;
    const next = Math.min(count, Math.max(1, page));
    if (get().currentPage === next) {
      return;
    }
    set({ currentPage: next });
  },

  setTool: (tool: EditorTool) => {
    set({ tool, editingId: tool === "text" ? null : get().editingId });
  },

  addTextBox: (pageIndex, pdfPoint) => {
    const document = get().document;
    if (!document) {
      return null;
    }
    const page = document.pageSizes[pageIndex];
    if (!page) {
      return null;
    }
    const box = createTextBox(pageIndex, pdfPoint);
    box.rect = clampRectToPage(box.rect, page.width, page.height);
    set({
      overlays: [...get().overlays, box],
      selectedId: box.id,
      editingId: box.id,
    });
    return box.id;
  },

  updateTextBox: (id, patch) => {
    set({
      overlays: get().overlays.map((overlay) => {
        if (overlay.id !== id || overlay.type !== "text") {
          return overlay;
        }
        const next: TextBox = { ...overlay };
        if (patch.content !== undefined) {
          next.content = patch.content;
        }
        if (patch.fontFamily !== undefined) {
          next.fontFamily = patch.fontFamily as FontFamily;
        }
        if (patch.fontSize !== undefined) {
          next.fontSize = patch.fontSize;
        }
        if (patch.color !== undefined) {
          next.color = patch.color;
        }
        if (patch.align !== undefined) {
          next.align = patch.align as TextAlign;
        }
        return next;
      }),
    });
  },

  updateOverlayRect: (id, rect) => {
    const document = get().document;
    set({
      overlays: get().overlays.map((overlay) => {
        if (overlay.id !== id) {
          return overlay;
        }
        const page = document?.pageSizes[overlay.pageIndex];
        const nextRect = page
          ? clampRectToPage(rect, page.width, page.height)
          : rect;
        return { ...overlay, rect: nextRect };
      }),
    });
  },

  deleteOverlay: (id) => {
    const selectedId = get().selectedId === id ? null : get().selectedId;
    const editingId = get().editingId === id ? null : get().editingId;
    set({
      overlays: get().overlays.filter((overlay) => overlay.id !== id),
      selectedId,
      editingId,
    });
  },

  selectOverlay: (id) => {
    const current = get();
    const nextEditing = id === current.editingId ? current.editingId : null;
    if (current.selectedId === id && current.editingId === nextEditing) {
      return;
    }
    set({
      selectedId: id,
      editingId: nextEditing,
    });
  },

  setEditingId: (id) => set({ editingId: id, selectedId: id ?? get().selectedId }),

  exportPdf: async () => {
    const current = get().document;
    if (!current || get().status === "exporting") {
      return;
    }
    const overlays = get().overlays;
    set({ status: "exporting", error: null });
    try {
      const { bakeOverlays, triggerDownload } = await import("@/lib/pdf/bake");
      const bytes = await bakeOverlays(current.sourceBytes, overlays);
      triggerDownload(bytes, editedFileName(current.name));
      const loaded = await loadPdfFromBytes(bytes);
      await destroyPdf(current.pdf);
      set({
        document: {
          name: editedFileName(current.name),
          sourceBytes: bytes,
          pageCount: loaded.pageCount,
          pageSizes: loaded.pageSizes,
          pdf: loaded.pdf,
        },
        overlays: [],
        selectedId: null,
        editingId: null,
        status: "idle",
        error: null,
      });
    } catch (cause) {
      set({
        status: "idle",
        error: toAppError(
          "BAKE",
          "导出 PDF",
          cause instanceof Error ? cause.message : "写入 PDF 失败",
        ),
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export function errorText(error: AppError | null): string | null {
  return error ? formatAppError(error) : null;
}

export function overlaysOnPage(
  overlays: OverlayObject[],
  pageIndex: number,
): OverlayObject[] {
  return overlays.filter((overlay) => overlay.pageIndex === pageIndex);
}
