"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { AppToast } from "./AppToast";
import { EditorEmptyState } from "./EditorEmptyState";
import { EditorToolbar } from "./EditorToolbar";
import { PageStage } from "./PageStage";
import { errorText, useDocumentStore } from "@/lib/store/documentStore";

export function EditorWorkspace() {
  const document = useDocumentStore((state) => state.document);
  const status = useDocumentStore((state) => state.status);
  const error = useDocumentStore((state) => state.error);
  const currentPage = useDocumentStore((state) => state.currentPage);
  const selectedId = useDocumentStore((state) => state.selectedId);
  const editingId = useDocumentStore((state) => state.editingId);
  const openFile = useDocumentStore((state) => state.openFile);
  const closeDocument = useDocumentStore((state) => state.closeDocument);
  const exportPdf = useDocumentStore((state) => state.exportPdf);
  const setCurrentPage = useDocumentStore((state) => state.setCurrentPage);
  const deleteOverlay = useDocumentStore((state) => state.deleteOverlay);
  const selectOverlay = useDocumentStore((state) => state.selectOverlay);
  const setEditingId = useDocumentStore((state) => state.setEditingId);
  const clearError = useDocumentStore((state) => state.clearError);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const takeFile = (file: File | undefined) => {
    if (!file || status === "loading") {
      return;
    }
    void openFile(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    takeFile(event.dataTransfer.files.item(0) ?? undefined);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement ||
        target?.isContentEditable;
      if (event.key === "Escape") {
        setEditingId(null);
        selectOverlay(null);
        return;
      }
      if (typing) {
        return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        deleteOverlay(selectedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, deleteOverlay, selectOverlay, setEditingId]);

  return (
    <div
      className="relative flex min-h-full flex-1 flex-col bg-stone-200"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <header className="flex h-12 items-center justify-between border-b border-line bg-panel px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Edit PDF
          </Link>
          {document ? (
            <span className="max-w-xs truncate text-sm text-stone-600">
              {document.name}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500">文件留在浏览器会话</span>
          <button
            type="button"
            disabled={status === "loading"}
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {status === "loading" ? "正在打开…" : "打开 PDF"}
          </button>
          {document ? (
            <>
              <button
                type="button"
                disabled={status === "exporting"}
                onClick={() => void exportPdf()}
                className="rounded-md bg-stone-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-70"
              >
                {status === "exporting" ? "正在导出…" : "保存导出"}
              </button>
              <button
                type="button"
                disabled={status === "exporting"}
                onClick={closeDocument}
                className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-70"
              >
                关闭
              </button>
            </>
          ) : null}
        </div>
      </header>

      {document ? (
        <>
          <EditorToolbar />
          <PageStage document={document} onVisiblePage={setCurrentPage} />
          <footer className="flex h-8 items-center justify-between border-t border-line bg-panel px-4 text-xs text-stone-600">
            <span>
              第 {currentPage} 页 / 共 {document.pageCount} 页
            </span>
            <span>
              {editingId ? "正在编辑文字" : "连续滚动预览 · 点「添加文字」后在页面上点击"}
            </span>
          </footer>
        </>
      ) : (
        <EditorEmptyState
          loading={status === "loading"}
          onOpenFile={takeFile}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => {
          takeFile(event.target.files?.item(0) ?? undefined);
          event.target.value = "";
        }}
      />

      {dragging ? (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-orange-50/80 text-sm font-medium text-accent">
          放开以打开 PDF
        </div>
      ) : null}

      <AppToast message={errorText(error)} onDismiss={clearError} />
    </div>
  );
}
