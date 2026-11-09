import type { PageSize, PdfHandle } from "./types";

let workerReady = false;

export type { PageSize, PdfHandle };

export interface LoadedPdf {
  pdf: PdfHandle;
  pageCount: number;
  pageSizes: PageSize[];
}

export async function loadPdfFromBytes(data: Uint8Array): Promise<LoadedPdf> {
  if (typeof window === "undefined") {
    throw new Error("PDF 只能在浏览器中打开");
  }

  const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
  if (!workerReady) {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    workerReady = true;
  }

  const task = pdfjs.getDocument({
    data: data.slice(),
    disableStream: true,
    disableAutoFetch: true,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/standard_fonts/",
  });
  const pdf = (await task.promise) as PdfHandle;
  const pageSizes: PageSize[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    pageSizes.push({ width: viewport.width, height: viewport.height });
  }

  return {
    pdf,
    pageCount: pdf.numPages,
    pageSizes,
  };
}
