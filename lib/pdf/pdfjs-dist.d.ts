declare module "pdfjs-dist/build/pdf.mjs" {
  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(params: {
    data: Uint8Array;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    cMapUrl?: string;
    cMapPacked?: boolean;
    standardFontDataUrl?: string;
  }): { promise: Promise<import("./types").PdfHandle> };
}
