# 接口定义

第一期没有远程业务 API。接口分三块：页面路由、编辑器命令、Worker 消息。

## 页面路由

| 路径 | 渲染 | robots | 说明 |
|------|------|--------|------|
| `/` | RSC | index | 产品首页 |
| `/tools/pdf-editor` | RSC | index | 在线编辑能力页 |
| `/tools/pdf-bookmark` | RSC | index | 书签能力页 |
| `/tools/pdf-sign` | RSC | index | 签名能力页 |
| `/tools/pdf-highlight` | RSC | index | 高亮能力页 |
| `/editor` | Client | noindex | 编辑工作台 |
| `/sitemap.xml` | Metadata | - | 列出落地页 |
| `/robots.txt` | Metadata | - | Allow 落地页，Disallow `/editor` |

落地页 Metadata 最小字段：`title`、`description`、`openGraph`。每页 H1 与 title 对应同一意图。

CTA：落地页「开始编辑」跳转 `/editor`。

## 编辑器命令

`documentStore` 对外命令。UI 与快捷键只调用这些函数。

| 命令 | 参数 | 行为 |
|------|------|------|
| `openFile` | `File` | 加载 PDF，替换当前文档 |
| `closeDocument` | - | 清空文档、叠加、书签、历史 |
| `setZoom` | `'width' \| 'page' \| number` | 25–400 或适应模式 |
| `goToPage` | `pageIndex` | 滚动目标页进入 Viewport |
| `rotateView` | `90 \| -90` | 仅显示旋转 |
| `setTool` | `'select' \| 'text'` | 切换选择 / 添加文字 |
| `addTextBox` | `pageIndex, pdfPoint` | 创建文字框并进入编辑 |
| `updateTextBox` | `id, patch` | 改文本/字体/字号/颜色/对齐 |
| `insertImage` | `pageIndex, File` | PNG/JPEG，宽不超过页宽 50% |
| `placeSignature` | `pageIndex, signatureId` | 放入已存签名 |
| `captureDrawnSignature` | `imageBytes` | 写入会话签名列表并放置 |
| `addHighlight` | `pageIndex, pdfRect, color` | 40% 透明高亮 |
| `updateOverlayRect` | `id, rect` | 拖拽或缩放 |
| `deleteOverlay` | `id` | 删除叠加对象 |
| `addBookmark` | `{ afterId?, title?, pageIndex }` | 插入书签 |
| `renameBookmark` | `id, title` | 重命名 |
| `deleteBookmark` | `id` | 删除节点及子孙 |
| `moveBookmark` | `id, parentId, index` | 改父级与顺序 |
| `setBookmarkDest` | `id, pageIndex` | 目标改为当前页 |
| `selectOverlay` | `id \| null` | 选中 |
| `undo` / `redo` | - | 叠加与书签历史 |
| `exportPdf` | - | bake、下载、重载预览 |

## Worker 消息

### pdfRenderWorker

请求：

```ts
type RenderRequest =
  | { type: 'init'; data: ArrayBuffer }
  | { type: 'renderPage'; pageIndex: number; scale: number }
  | { type: 'renderThumb'; pageIndex: number }
  | { type: 'getOutline' }
  | { type: 'getTextContent'; pageIndex: number }
```

响应：

```ts
type RenderResponse =
  | { type: 'init'; pageCount: number; pageSizes: { width: number; height: number }[] }
  | { type: 'renderPage'; pageIndex: number; imageBitmap: ImageBitmap }
  | { type: 'renderThumb'; pageIndex: number; imageBitmap: ImageBitmap }
  | { type: 'getOutline'; outline: OutlineNode[] }
  | { type: 'getTextContent'; pageIndex: number; items: TextItem[] }
  | { type: 'error'; message: string }
```

`init` 的 `data` 使用 Transferable。

### pdfBakeWorker

请求：

```ts
type BakeRequest = {
  type: 'bake'
  source: ArrayBuffer
  overlays: OverlayBase[]
  bookmarks: Bookmark[]
}
```

响应：

```ts
type BakeResponse =
  | { type: 'bake'; bytes: Uint8Array }
  | { type: 'progress'; ratio: number }
  | { type: 'error'; message: string }
```

## 数据形状

详见设计文档 Data Models。坐标一律 PDF 用户空间；Konva 边界经 `pageMetrics` 转换。

## 错误形状

```ts
interface AppError {
  code: 'PARSE' | 'IMAGE' | 'RENDER' | 'BAKE' | 'MEMORY'
  action: string
  message: string
}
```

展示在 `AppToast`。失败命令保持上一次成功状态。
