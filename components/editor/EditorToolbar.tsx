"use client";

import { PHASE1_FONTS, type FontFamily, type TextAlign, type TextBox } from "@/lib/pdf/overlay";
import { useDocumentStore } from "@/lib/store/documentStore";

const SIZES = [10, 12, 14, 16, 18, 22, 28, 36];
const ALIGNS: { id: TextAlign; label: string }[] = [
  { id: "left", label: "左齐" },
  { id: "center", label: "居中" },
  { id: "right", label: "右齐" },
];

export function EditorToolbar() {
  const tool = useDocumentStore((state) => state.tool);
  const setTool = useDocumentStore((state) => state.setTool);
  const overlays = useDocumentStore((state) => state.overlays);
  const selectedId = useDocumentStore((state) => state.selectedId);
  const updateTextBox = useDocumentStore((state) => state.updateTextBox);
  const deleteOverlay = useDocumentStore((state) => state.deleteOverlay);
  const selected = overlays.find(
    (overlay): overlay is TextBox => overlay.id === selectedId && overlay.type === "text",
  );

  return (
    <div className="flex h-10 items-center gap-2 border-b border-line bg-panel px-3 text-xs">
      <button
        type="button"
        onClick={() => setTool("select")}
        className={toolButton(tool === "select")}
      >
        选择
      </button>
      <button
        type="button"
        onClick={() => setTool("text")}
        className={toolButton(tool === "text")}
      >
        添加文字
      </button>
      <span className="mx-1 h-4 w-px bg-line" />
      <label className="flex items-center gap-1 text-stone-600">
        字体
        <select
          disabled={!selected}
          value={selected?.fontFamily ?? "NotoSansSC"}
          onChange={(event) =>
            selected &&
            updateTextBox(selected.id, {
              fontFamily: event.target.value as FontFamily,
            })
          }
          className="h-7 rounded border border-line bg-white px-1 disabled:opacity-40"
        >
          {PHASE1_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1 text-stone-600">
        字号
        <select
          disabled={!selected}
          value={selected?.fontSize ?? 14}
          onChange={(event) =>
            selected &&
            updateTextBox(selected.id, { fontSize: Number(event.target.value) })
          }
          className="h-7 rounded border border-line bg-white px-1 disabled:opacity-40"
        >
          {SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1 text-stone-600">
        颜色
        <input
          type="color"
          disabled={!selected}
          value={selected?.color ?? "#1c1917"}
          onChange={(event) =>
            selected && updateTextBox(selected.id, { color: event.target.value })
          }
          className="h-7 w-8 cursor-pointer rounded border border-line bg-white disabled:opacity-40"
        />
      </label>
      <div className="flex items-center gap-1">
        {ALIGNS.map((align) => (
          <button
            key={align.id}
            type="button"
            disabled={!selected}
            onClick={() => selected && updateTextBox(selected.id, { align: align.id })}
            className={toolButton(selected?.align === align.id)}
          >
            {align.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && deleteOverlay(selected.id)}
        className="ml-auto rounded-md border border-line px-2 py-1 font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
      >
        删除
      </button>
    </div>
  );
}

function toolButton(active: boolean) {
  return `rounded-md px-2 py-1 font-medium disabled:opacity-40 ${
    active
      ? "bg-orange-50 text-accent ring-1 ring-accent/40"
      : "text-stone-700 hover:bg-stone-50"
  }`;
}
