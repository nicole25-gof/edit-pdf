import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTextBox } from "@/lib/pdf/overlay";
import { useDocumentStore } from "./documentStore";

const loadPdfFromBytes = vi.fn();
const bakeOverlays = vi.fn();
const triggerDownload = vi.fn();

vi.mock("@/lib/pdf/pdfjs", () => ({
  loadPdfFromBytes: (...args: unknown[]) => loadPdfFromBytes(...args),
}));

vi.mock("@/lib/pdf/bake", () => ({
  bakeOverlays: (...args: unknown[]) => bakeOverlays(...args),
  triggerDownload: (...args: unknown[]) => triggerDownload(...args),
}));

function resetStore() {
  useDocumentStore.setState({
    document: {
      name: "demo.pdf",
      sourceBytes: new Uint8Array([1]),
      pageCount: 2,
      pageSizes: [
        { width: 595, height: 842 },
        { width: 595, height: 842 },
      ],
      pdf: {
        numPages: 2,
        getPage: async () => {
          throw new Error("unused");
        },
        destroy: async () => undefined,
      },
    },
    overlays: [],
    selectedId: null,
    editingId: null,
    tool: "select",
    status: "idle",
    error: null,
    currentPage: 1,
  });
}

describe("documentStore text overlays", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates a text box at the click and enters edit", () => {
    const id = useDocumentStore.getState().addTextBox(0, { x: 80, y: 400 });
    const state = useDocumentStore.getState();
    expect(id).toBeTruthy();
    expect(state.overlays).toHaveLength(1);
    expect(state.overlays[0]?.type).toBe("text");
    expect(state.selectedId).toBe(id);
    expect(state.editingId).toBe(id);
  });

  it("updates text style fields", () => {
    const box = createTextBox(0, { x: 40, y: 200 }, "t1");
    useDocumentStore.setState({ overlays: [box], selectedId: "t1" });
    useDocumentStore.getState().updateTextBox("t1", {
      content: "标题",
      fontFamily: "Helvetica",
      fontSize: 22,
      color: "#c2410c",
      align: "center",
    });
    const updated = useDocumentStore.getState().overlays[0];
    expect(updated).toMatchObject({
      id: "t1",
      content: "标题",
      fontFamily: "Helvetica",
      fontSize: 22,
      color: "#c2410c",
      align: "center",
    });
  });

  it("moves a box in the same mutation", () => {
    const box = createTextBox(0, { x: 40, y: 200 }, "t1");
    useDocumentStore.setState({ overlays: [box] });
    useDocumentStore.getState().updateOverlayRect("t1", {
      x: 120,
      y: 300,
      width: 180,
      height: 36,
    });
    expect(useDocumentStore.getState().overlays[0]?.rect).toMatchObject({
      x: 120,
      y: 300,
    });
  });

  it("deletes the selected box", () => {
    const box = createTextBox(0, { x: 40, y: 200 }, "t1");
    useDocumentStore.setState({
      overlays: [box],
      selectedId: "t1",
      editingId: "t1",
    });
    useDocumentStore.getState().deleteOverlay("t1");
    expect(useDocumentStore.getState().overlays).toEqual([]);
    expect(useDocumentStore.getState().selectedId).toBeNull();
  });

  it("clears overlays when the document closes", () => {
    const box = createTextBox(0, { x: 40, y: 200 }, "t1");
    useDocumentStore.setState({ overlays: [box], selectedId: "t1" });
    useDocumentStore.getState().closeDocument();
    expect(useDocumentStore.getState().document).toBeNull();
    expect(useDocumentStore.getState().overlays).toEqual([]);
  });

  it("bakes overlays, downloads, and reloads preview", async () => {
    const box = createTextBox(0, { x: 40, y: 200 }, "t1");
    box.content = "Hello";
    const exported = new Uint8Array([9, 8, 7]);
    bakeOverlays.mockResolvedValue(exported);
    loadPdfFromBytes.mockResolvedValue({
      pageCount: 2,
      pageSizes: [
        { width: 595, height: 842 },
        { width: 595, height: 842 },
      ],
      pdf: {
        numPages: 2,
        getPage: async () => {
          throw new Error("unused");
        },
        destroy: async () => undefined,
      },
    });
    useDocumentStore.setState({ overlays: [box] });
    await useDocumentStore.getState().exportPdf();
    expect(bakeOverlays).toHaveBeenCalled();
    expect(triggerDownload).toHaveBeenCalledWith(exported, "demo-edited.pdf");
    const state = useDocumentStore.getState();
    expect(state.overlays).toEqual([]);
    expect(state.document?.name).toBe("demo-edited.pdf");
    expect(state.status).toBe("idle");
  });
});
