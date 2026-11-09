# Requirements Document

## Introduction

在线 PDF 编辑器是一款浏览器内使用的 PDF 工具。用户打开本地 PDF 后，在页面上添加或删除文字、图片、签名与高亮，编辑结果立即显示在当前页；用户可管理与福昕 PDF 同类的书签树，并导出仍可被福昕 / Acrobat 打开的 PDF。营销落地页面向搜索引擎收录；编辑器在客户端运行，文件字节留在浏览器会话内。

本文件覆盖第一期范围。第二期、第三期能力列在文末，作为后续规格输入。

## Glossary

- **System**: 在线 PDF 编辑器 Web 应用，含营销落地页与编辑器工作台。
- **User**: 在浏览器中打开、编辑、导出 PDF 的操作者。
- **Document**: 当前会话中已打开的一份 PDF，及其叠加对象与书签树。
- **Page**: Document 中的一页，具有页码、宽度、高度。
- **Overlay Object**: 叠在 Page 上的可编辑对象，类型为文字框、图片、签名或高亮。
- **Text Box**: 用户添加的文字叠加对象，含位置、尺寸、文本、字体、字号、颜色、对齐。
- **Image Object**: 用户插入的位图叠加对象，含位置、尺寸、源图。
- **Signature Object**: 手写或图片签名叠加对象，含位置、尺寸、签名图。
- **Highlight Object**: 覆盖文本区域的半透明高亮叠加对象，含矩形、颜色。
- **Bookmark**: PDF Outline 中的一个导航节点，含标题、目标页、可选父节点与兄弟顺序。
- **Bookmark Tree**: Document 的完整书签层级，对应 PDF `/Outlines`。
- **Viewport**: 编辑器中当前可见的页面区域与缩放比例。
- **Export File**: 将 Overlay Object 与 Bookmark Tree 写入后生成的 PDF 字节。
- **Landing Page**: 面向搜索引擎的公开介绍页。
- **Editor Workspace**: 打开 Document 后的编辑界面。

## Requirements

### Requirement 1: 打开与关闭文档

**User Story:** AS User, I want to open a local PDF in the browser, so that the User can start viewing and editing without sending the file to a remote processor.

#### Acceptance Criteria

1. WHEN the User selects a `.pdf` file via the file picker or drops a `.pdf` file onto the Editor Workspace, the System SHALL load the file into the current session and display the first Page within 3 seconds for files at or below 20 MB on a reference desktop browser.
2. WHEN the System finishes loading a Document, the System SHALL show the total page count and the current page number.
3. IF the selected file is not a PDF or the PDF parser rejects the file, the System SHALL show an error message that names the failure reason and keep the previous Document unchanged when a previous Document exists.
4. WHEN the User chooses Close, the System SHALL clear the current Document, Overlay Objects, Bookmark Tree, and undo history from the session.
5. WHEN the User opens a Document, the System SHALL keep the source bytes in browser session memory for the lifetime of that Document.

### Requirement 2: 页面查看与导航

**User Story:** AS User, I want to scroll, jump, and zoom pages the way Foxit Viewer does, so that the User can locate content in a multi-page Document.

#### Acceptance Criteria

1. WHILE a Document is open, the System SHALL render Pages in a single-column continuous scroll view.
2. WHEN the User enters a page number and confirms, the System SHALL scroll that Page into the Viewport.
3. WHEN the User chooses First Page or Last Page, the System SHALL scroll the corresponding Page into the Viewport.
4. WHILE a Document is open, the System SHALL provide zoom actions: fit-to-width, fit-to-page, and a numeric zoom percentage in the range 25% to 400%.
5. WHEN the User chooses marquee zoom and drags a rectangle on a Page, the System SHALL set Viewport zoom so that the selected rectangle fills the Viewport width.
6. WHILE a Document is open, the System SHALL show page thumbnails in a left sidebar; WHEN the User clicks a thumbnail, the System SHALL scroll that Page into the Viewport.
7. WHEN the User chooses rotate view clockwise or counterclockwise, the System SHALL rotate the current Page display by 90 degrees; the System SHALL treat this rotation as a view transform in Phase 1.
8. WHILE Pages are outside a buffer of 2 Pages above and 2 Pages below the Viewport, the System SHALL keep those Pages unloaded from the render surface.

### Requirement 3: 文字框叠加

**User Story:** AS User, I want to add, move, edit, and delete text on a Page, so that the User can annotate or caption the Document and see the result immediately.

#### Acceptance Criteria

1. WHEN the User chooses the Add Text tool and clicks a Page, the System SHALL create a Text Box at the click position and place the text caret inside that Text Box.
2. WHILE a Text Box is selected, the System SHALL allow the User to edit the text content, font family from the Phase 1 font list, font size, fill color, and horizontal alignment (left, center, right).
3. WHEN the User drags a selected Text Box, the System SHALL update the Text Box position on the Page in the same pointer move, with the new position visible before the pointer is released.
4. WHEN the User resizes a selected Text Box via its handles, the System SHALL update the Text Box size in the same pointer move.
5. WHEN the User deletes a selected Text Box, the System SHALL remove that Text Box from the Page and from the Viewport.
6. WHEN a Text Box changes, the System SHALL show the updated Text Box on the current Page without waiting for Export File generation.
7. Phase 1 font list SHALL include: Noto Sans SC, Noto Serif SC, and Helvetica.

### Requirement 4: 图片叠加

**User Story:** AS User, I want to insert images onto a Page, so that the User can stamp logos or figures onto the Document.

#### Acceptance Criteria

1. WHEN the User chooses Insert Image and selects a PNG or JPEG file, the System SHALL create an Image Object on the current Page, scaled to fit within 50% of the Page width while preserving aspect ratio.
2. WHEN the User drags or resizes a selected Image Object, the System SHALL update position or size in the same pointer move, preserving aspect ratio during resize.
3. WHEN the User deletes a selected Image Object, the System SHALL remove that Image Object from the Page and from the Viewport.
4. IF the selected image file is larger than 10 MB or uses a type other than PNG or JPEG, the System SHALL show an error message and leave the Document unchanged.

### Requirement 5: 签名

**User Story:** AS User, I want to place a handwritten or image signature on a Page, so that the User can sign the Document in a Foxit-like fill-and-sign flow.

#### Acceptance Criteria

1. WHEN the User chooses Draw Signature, the System SHALL open a signature pad; WHEN the User confirms the stroke, the System SHALL store that signature in the session signature list and place a Signature Object on the current Page.
2. WHEN the User chooses Image Signature and selects a PNG or JPEG file, the System SHALL store that signature in the session signature list and place a Signature Object on the current Page.
3. WHILE the session signature list contains at least one signature, the System SHALL let the User reuse a stored signature to place another Signature Object.
4. WHEN the User drags, resizes, or deletes a selected Signature Object, the System SHALL apply the change on the Page in the same interaction, preserving aspect ratio during resize.
5. WHEN a Signature Object is placed or moved, the System SHALL show the Signature Object on the current Page without waiting for Export File generation.

### Requirement 6: 高亮注释

**User Story:** AS User, I want to highlight text regions and list those highlights, so that the User can mark passages the way Foxit Comment highlight does.

#### Acceptance Criteria

1. WHEN the User chooses the Highlight tool and drags a rectangle over a Page, the System SHALL create a Highlight Object for that rectangle with the current highlight color and 40% opacity.
2. WHILE the Highlight tool is active, the System SHALL provide at least four highlight colors: yellow, green, pink, and blue.
3. WHEN the User deletes a selected Highlight Object, the System SHALL remove that Highlight Object from the Page and from the comment list.
4. WHILE a Document contains Highlight Objects, the System SHALL list each Highlight Object in a left comment panel, showing page number and color.
5. WHEN the User clicks a comment list item, the System SHALL scroll the corresponding Page into the Viewport and select that Highlight Object.
6. WHEN a Highlight Object is created, the System SHALL show the highlight on the current Page without waiting for Export File generation.

### Requirement 7: 书签（对标福昕书签面板）

**User Story:** AS User, I want a Foxit-style bookmark tree, so that the User can navigate long Documents and persist the outline in the Export File.

#### Acceptance Criteria

1. WHEN the System opens a Document that already contains a PDF Outline, the System SHALL display that Outline as a Bookmark Tree in the left bookmark panel, preserving titles, parent-child relations, and sibling order.
2. WHEN the User chooses Add Bookmark, the System SHALL append a Bookmark whose destination is the current Page and whose default title is `Page {n}` using the current page number, unless a text selection exists.
3. WHEN the User has a text selection on the current Page and chooses Add Bookmark, the System SHALL use the selected text, truncated to 80 characters, as the Bookmark title.
4. WHEN a Bookmark is selected in the tree and the User chooses Add Bookmark, the System SHALL insert the new Bookmark as the next sibling after the selected Bookmark.
5. WHEN the User double-clicks a Bookmark title, the System SHALL allow rename; WHEN the User confirms, the System SHALL store the new title.
6. WHEN the User deletes a Bookmark, the System SHALL remove that Bookmark and every descendant Bookmark from the Bookmark Tree.
7. WHEN the User drags a Bookmark onto another Bookmark or onto a drop indicator between Bookmarks, the System SHALL update parent and sibling order to match the drop position.
8. WHEN the User clicks a Bookmark, the System SHALL scroll the destination Page into the Viewport.
9. WHEN the User chooses Expand All or Collapse All, the System SHALL expand or collapse every node in the Bookmark Tree.
10. WHEN the User chooses Set Destination on a selected Bookmark, the System SHALL set that Bookmark destination to the current Page.
11. WHEN the System writes an Export File, the System SHALL write the Bookmark Tree into the PDF Outline so that Foxit and Acrobat show the same titles, hierarchy, and page destinations.

### Requirement 8: 即时预览与导出

**User Story:** AS User, I want edits to appear on the page immediately and a downloadable PDF that keeps those edits, so that the User can verify and share the result.

#### Acceptance Criteria

1. WHEN the User creates, moves, resizes, edits, or deletes an Overlay Object, the System SHALL reflect the change on the current Page on the next animation frame after the pointer or keyboard event.
2. WHEN the User chooses Save or Save As, the System SHALL produce an Export File that contains every Overlay Object baked into page content and the current Bookmark Tree as Outline.
3. WHEN Export File generation completes, the System SHALL trigger a browser download named `{original-filename}-edited.pdf`.
4. WHEN Export File generation completes, the System SHALL reload the current Page preview from the Export File bytes so that baked content matches the download.
5. IF Export File generation fails, the System SHALL show an error message, keep Overlay Objects editable, and leave the last successful preview in place.
6. WHILE Export File generation is running for a Document larger than 20 MB, the System SHALL show a progress indicator and keep the Editor Workspace responsive to scroll and zoom.

### Requirement 9: 撤销与重做

**User Story:** AS User, I want undo and redo, so that the User can reverse overlay and bookmark mistakes.

#### Acceptance Criteria

1. WHEN the User performs an overlay or bookmark mutation, the System SHALL push that mutation onto an undo stack with a maximum of 50 entries.
2. WHEN the User chooses Undo and the undo stack is non-empty, the System SHALL restore the previous Document overlay and bookmark state and show that state on the Viewport.
3. WHEN the User chooses Redo and the redo stack is non-empty, the System SHALL reapply the undone mutation and show that state on the Viewport.
4. WHEN a new mutation occurs after Undo, the System SHALL clear the redo stack.

### Requirement 10: 编辑器工作台布局

**User Story:** AS User, I want a Foxit-like workspace, so that the User can find tools in familiar places.

#### Acceptance Criteria

1. WHILE a Document is open, the System SHALL show a top ribbon with groups: File, View, Edit, Comment, Fill and Sign, Bookmark.
2. WHILE a Document is open, the System SHALL show a left navigation rail that switches among Thumbnails, Bookmarks, and Comments.
3. WHILE a Document is open, the System SHALL show a status bar with current page number, total pages, and zoom percentage.
4. WHEN no Document is open, the System SHALL show an empty state with Open and Drop-file actions.

### Requirement 11: 营销落地页与 SEO

**User Story:** AS a search visitor, I want indexable pages that explain the PDF editor, so that the visitor can discover the tool and open the Editor Workspace.

#### Acceptance Criteria

1. WHEN a crawler requests `/`, `/tools/pdf-editor`, `/tools/pdf-bookmark`, `/tools/pdf-sign`, or `/tools/pdf-highlight`, the System SHALL return server-rendered HTML that includes a unique title, meta description, and H1 matching that page intent.
2. WHEN a crawler requests `/sitemap.xml`, the System SHALL return a sitemap that lists every Landing Page URL.
3. WHEN a crawler requests `/robots.txt`, the System SHALL allow indexing of Landing Pages and disallow indexing of `/editor`.
4. WHEN a visitor on a Landing Page chooses Start Editing, the System SHALL navigate to `/editor`.
5. WHEN a crawler requests `/editor`, the System SHALL send `noindex` in robots metadata.

### Requirement 12: 文件与会话边界

**User Story:** AS User, I want the PDF to stay in the browser session, so that the User can edit privately on this device.

#### Acceptance Criteria

1. WHEN the User opens, previews, or exports a Document, the System SHALL perform parse, render, overlay, and bake operations in the browser.
2. WHEN the User refreshes the Editor Workspace, the System SHALL show the empty state; Phase 1 persistence is session-memory only.
3. WHILE a Document is open, the System SHALL display a privacy notice that the file stays in the browser.

## Out of Scope (Phase 1)

The following Foxit-aligned capabilities are deferred. Each item is a placeholder for a future requirements document.

### Phase 2

- Underline, strikethrough, squiggly underline
- Sticky note and free text comment
- Shape drawing: rectangle, ellipse, arrow, pencil, eraser
- Stamp and date stamp
- Page links and URL links
- Page organize: insert, delete, bake rotation, reorder, extract
- Merge and split
- Watermark, header, footer, page number
- Create a table-of-contents page from the Bookmark Tree
- Bookmark appearance: color and bold

### Phase 3

- In-place edit of original PDF text and images
- AcroForm fill and flatten
- OCR
- Encryption, permissions, redaction, certificate signatures
- Convert to Word, image, or PPT
- Cloud storage, multi-tab documents, shared comment threads
- Bates numbering, PDF/A, document compare
