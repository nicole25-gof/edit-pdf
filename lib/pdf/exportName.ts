export function editedFileName(originalName: string): string {
  const trimmed = originalName.trim() || "document.pdf";
  const withoutExt = trimmed.replace(/\.pdf$/i, "");
  return `${withoutExt || "document"}-edited.pdf`;
}
