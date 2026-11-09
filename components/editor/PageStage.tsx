"use client";

import { useEffect, useRef } from "react";
import type { OpenDocument } from "@/lib/store/documentStore";
import { OverlayLayer } from "./OverlayLayer";
import { PdfPageCanvas } from "./PdfPageCanvas";

interface PageStageProps {
  document: OpenDocument;
  onVisiblePage: (page: number) => void;
}

const MAX_PAGE_WIDTH = 820;

export function PageStage({ document, onVisiblePage }: PageStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) {
          return;
        }
        const page = Number(visible.target.getAttribute("data-page"));
        if (Number.isFinite(page)) {
          onVisiblePage(page);
        }
      },
      { root, threshold: [0.4, 0.6] },
    );

    pages.forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, [document.pdf, onVisiblePage]);

  return (
    <div ref={rootRef} className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        {document.pageSizes.map((size, index) => {
          const scale = Math.min(1, MAX_PAGE_WIDTH / size.width);
          const width = Math.round(size.width * scale);
          const height = Math.round(size.height * scale);
          const pageNumber = index + 1;
          return (
            <section
              key={`${document.name}-${pageNumber}`}
              data-page={pageNumber}
              className="relative overflow-visible bg-white shadow-md ring-1 ring-stone-300"
              style={{ width, height }}
            >
              <PdfPageCanvas
                pdf={document.pdf}
                pageNumber={pageNumber}
                width={width}
                height={height}
              />
              <OverlayLayer pageIndex={index} page={size} scale={scale} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
