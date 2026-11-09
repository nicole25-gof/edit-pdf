"use client";

import { useEffect, useRef, useState } from "react";
import type { PdfHandle } from "@/lib/pdf/types";

interface PdfPageCanvasProps {
  pdf: PdfHandle;
  pageNumber: number;
  width: number;
  height: number;
}

export function PdfPageCanvas({
  pdf,
  pageNumber,
  width,
  height,
}: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const render = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) {
          return;
        }
        const unscaled = page.getViewport({ scale: 1 });
        const scale = width / unscaled.width;
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: scale * outputScale });
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("无法创建画布");
        }
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;
        if (!cancelled) {
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, width, height]);

  if (failed) {
    return (
      <div
        className="flex items-center justify-center bg-stone-100 text-sm text-stone-500"
        style={{ width, height }}
      >
        第 {pageNumber} 页无法渲染
      </div>
    );
  }

  return <canvas ref={canvasRef} className="block bg-white" />;
}
