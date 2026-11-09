"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { cssToPdf } from "@/lib/pdf/pageMetrics";
import type { PageSize } from "@/lib/pdf/types";
import { useDocumentStore } from "@/lib/store/documentStore";
import { TextBoxNode } from "./TextBoxNode";

interface OverlayLayerProps {
  pageIndex: number;
  page: PageSize;
  scale: number;
}

export function OverlayLayer({ pageIndex, page, scale }: OverlayLayerProps) {
  const overlays = useDocumentStore((state) => state.overlays);
  const selectedId = useDocumentStore((state) => state.selectedId);
  const editingId = useDocumentStore((state) => state.editingId);
  const tool = useDocumentStore((state) => state.tool);
  const addTextBox = useDocumentStore((state) => state.addTextBox);
  const selectOverlay = useDocumentStore((state) => state.selectOverlay);
  const setEditingId = useDocumentStore((state) => state.setEditingId);
  const updateTextBox = useDocumentStore((state) => state.updateTextBox);
  const updateOverlayRect = useDocumentStore((state) => state.updateOverlayRect);

  const onLayerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const cssX = event.clientX - bounds.left;
    const cssY = event.clientY - bounds.top;
    if (tool === "text") {
      const point = cssToPdf(cssX, cssY, page.width, page.height, scale);
      addTextBox(pageIndex, point);
      return;
    }
    selectOverlay(null);
  };

  return (
    <div
      className="absolute inset-0 z-10"
      style={{ cursor: tool === "text" ? "crosshair" : "default" }}
      onPointerDown={onLayerPointerDown}
    >
      {overlays.map((overlay) => {
        if (overlay.type !== "text" || overlay.pageIndex !== pageIndex) {
          return null;
        }
        return (
          <TextBoxNode
            key={overlay.id}
            box={overlay}
            page={page}
            scale={scale}
            selected={selectedId === overlay.id}
            editing={editingId === overlay.id}
            onSelect={() => selectOverlay(overlay.id)}
            onEdit={() => setEditingId(overlay.id)}
            onChangeContent={(content) => updateTextBox(overlay.id, { content })}
            onChangeRect={(rect) => updateOverlayRect(overlay.id, rect)}
          />
        );
      })}
    </div>
  );
}
