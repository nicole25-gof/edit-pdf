export const MAX_OPEN_BYTES_SOFT = 50 * 1024 * 1024;

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

export function confirmLargeFile(file: File): boolean {
  if (file.size <= MAX_OPEN_BYTES_SOFT) {
    return true;
  }
  return window.confirm(
    `文件约 ${(file.size / (1024 * 1024)).toFixed(1)} MB，可能占用较多内存。确定打开吗？`,
  );
}
