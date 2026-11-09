"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { fontCssFamily, type Rect, type TextBox } from "@/lib/pdf/overlay";
import { pdfRectToCss, cssRectToPdf } from "@/lib/pdf/pageMetrics";
import type { PageSize } from "@/lib/pdf/types";

interface TextBoxNodeProps {
  box: TextBox;
  page: PageSize;
  scale: number;
  selected: boolean;
  editing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onChangeContent: (content: string) => void;
  onChangeRect: (rect: Rect) => void;
}

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: Handle[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

export function TextBoxNode({
  box,
  page,
  scale,
  selected,
  editing,
  onSelect,
  onEdit,
  onChangeContent,
  onChangeRect,
}: TextBoxNodeProps) {
  const css = pdfRectToCss(box.rect, page.width, page.height, scale);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragRef = useRef<{
    kind: "move" | "resize";
    handle?: Handle;
    startX: number;
    startY: number;
    start: typeof css;
  } | null>(null);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [editing]);

  const commitCssRect = (next: typeof css) => {
    onChangeRect(cssRectToPdf(next, page.width, page.height, scale));
  };

  const onBoxPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect();
    if (editing || event.button !== 0) {
      return;
    }
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    dragRef.current = {
      kind: "move",
      startX: event.clientX,
      startY: event.clientY,
      start: css,
    };
  };

  const onHandlePointerDown = (
    event: ReactPointerEvent<HTMLSpanElement>,
    handle: Handle,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    onSelect();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      kind: "resize",
      handle,
      startX: event.clientX,
      startY: event.clientY,
      start: css,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.kind === "move") {
      commitCssRect({
        ...drag.start,
        x: drag.start.x + dx,
        y: drag.start.y + dy,
      });
      return;
    }
    commitCssRect(resizeCss(drag.start, drag.handle ?? "se", dx, dy));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      data-overlay-id={box.id}
      className={`absolute box-border ${
        selected ? "ring-2 ring-accent" : "ring-1 ring-transparent hover:ring-accent/50"
      }`}
      style={{
        left: css.x,
        top: css.y,
        width: css.width,
        height: css.height,
        cursor: editing ? "text" : "move",
      }}
      onPointerDown={onBoxPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onEdit();
      }}
    >
      {editing ? (
        <textarea
          ref={textareaRef}
          value={box.content}
          onChange={(event) => onChangeContent(event.target.value)}
          onPointerDown={(event) => event.stopPropagation()}
          className="h-full w-full resize-none bg-white/80 px-1 py-0.5 outline-none"
          style={{
            fontFamily: fontCssFamily(box.fontFamily),
            fontSize: box.fontSize * scale,
            color: box.color,
            textAlign: box.align,
            lineHeight: 1.3,
          }}
          placeholder="输入文字"
        />
      ) : (
        <div
          className="h-full w-full overflow-hidden bg-white/40 px-1 py-0.5 whitespace-pre-wrap"
          style={{
            fontFamily: fontCssFamily(box.fontFamily),
            fontSize: box.fontSize * scale,
            color: box.color,
            textAlign: box.align,
            lineHeight: 1.3,
          }}
        >
          {box.content || "输入文字"}
        </div>
      )}
      {selected && !editing
        ? HANDLES.map((handle) => (
            <span
              key={handle}
              onPointerDown={(event) => onHandlePointerDown(event, handle)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute z-10 h-2.5 w-2.5 rounded-sm bg-white ring-1 ring-accent"
              style={handleStyle(handle)}
            />
          ))
        : null}
    </div>
  );
}

function handleStyle(handle: Handle): { left?: string; right?: string; top?: string; bottom?: string; cursor: string; transform: string } {
  const cursor: Record<Handle, string> = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
  };
  const pos: Record<Handle, { left?: string; right?: string; top?: string; bottom?: string; transform: string }> = {
    n: { left: "50%", top: "0", transform: "translate(-50%, -50%)" },
    s: { left: "50%", bottom: "0", transform: "translate(-50%, 50%)" },
    e: { right: "0", top: "50%", transform: "translate(50%, -50%)" },
    w: { left: "0", top: "50%", transform: "translate(-50%, -50%)" },
    ne: { right: "0", top: "0", transform: "translate(50%, -50%)" },
    nw: { left: "0", top: "0", transform: "translate(-50%, -50%)" },
    se: { right: "0", bottom: "0", transform: "translate(50%, 50%)" },
    sw: { left: "0", bottom: "0", transform: "translate(-50%, 50%)" },
  };
  return { ...pos[handle], cursor: cursor[handle] };
}

function resizeCss(
  start: { x: number; y: number; width: number; height: number },
  handle: Handle,
  dx: number,
  dy: number,
) {
  let { x, y, width, height } = start;
  if (handle.includes("e")) {
    width = start.width + dx;
  }
  if (handle.includes("s")) {
    height = start.height + dy;
  }
  if (handle.includes("w")) {
    x = start.x + dx;
    width = start.width - dx;
  }
  if (handle.includes("n")) {
    y = start.y + dy;
    height = start.height - dy;
  }
  if (width < 24) {
    if (handle.includes("w")) {
      x = start.x + start.width - 24;
    }
    width = 24;
  }
  if (height < 18) {
    if (handle.includes("n")) {
      y = start.y + start.height - 18;
    }
    height = 18;
  }
  return { x, y, width, height };
}
