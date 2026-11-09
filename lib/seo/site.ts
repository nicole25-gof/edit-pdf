export const SITE_NAME = "Edit PDF";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const homeMetadata = {
  title: "在线 PDF 编辑器 — 浏览器内添加文字、签名与书签",
  description:
    "在浏览器中打开 PDF，添加文字、图片、签名和高亮，管理福昕风格书签，编辑结果立即显示在当前页。文件留在本地会话。",
};

export const editorMetadata = {
  title: "编辑 PDF",
  description: "在浏览器中打开并编辑 PDF。",
};
