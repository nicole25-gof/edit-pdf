"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface EditorEmptyStateProps {
  loading: boolean;
  onOpenFile: (file: File) => void;
}

export function EditorEmptyState({ loading, onOpenFile }: EditorEmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const takeFile = (file: File | undefined) => {
    if (!file || loading) {
      return;
    }
    onOpenFile(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    takeFile(event.dataTransfer.files.item(0) ?? undefined);
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    takeFile(event.target.files?.item(0) ?? undefined);
    event.target.value = "";
  };

  return (
    <div
      className={`flex flex-1 items-center justify-center p-8 ${
        dragging ? "bg-orange-50/60" : ""
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div
        className={`w-full max-w-lg rounded-xl border border-dashed bg-panel px-8 py-12 text-center ${
          dragging ? "border-accent" : "border-stone-400"
        }`}
      >
        <h1 className="text-xl font-semibold text-stone-900">打开 PDF 开始编辑</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          将 PDF 拖到此处，或选择本地文件。文件留在浏览器会话，不上传到服务器。
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "正在打开…" : "打开 PDF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={onPick}
        />
      </div>
    </div>
  );
}
