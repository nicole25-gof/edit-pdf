export function hexToRgb(color: string): { r: number; g: number; b: number } {
  const hex = color.replace("#", "").trim();
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return { r: 0.11, g: 0.1, b: 0.09 };
  }
  return {
    r: parseInt(normalized.slice(0, 2), 16) / 255,
    g: parseInt(normalized.slice(2, 4), 16) / 255,
    b: parseInt(normalized.slice(4, 6), 16) / 255,
  };
}
