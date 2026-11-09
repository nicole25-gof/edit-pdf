# 在线 PDF 编辑器 文档

## 项目概述

在线 PDF 编辑器是一款浏览器内 PDF 工具。用户打开本地 PDF，在页面上添加或删除文字、图片、签名与高亮，结果立即显示在当前页；书签树对标福昕书签面板，导出文件可被福昕 / Acrobat 打开。营销落地页服务搜索收录；编辑器在客户端运行，文件字节留在浏览器会话内。

**目标用户**: 需要在网页里快速批注、签名、加书签并导出 PDF 的个人与办公用户。

**核心价值**:
- 编辑后当前页立即可见，无需等服务端回传
- 书签增删改层级与福昕书签面板同类
- 落地页可被搜索引擎收录，编辑器路由不收录

## 技术选型

| 类别 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 15 App Router + TypeScript | 落地页 SSR / Metadata SEO；编辑器做 Client Island |
| 样式 | Tailwind CSS | 落地页与 Ribbon 工作台共用一套工具类 |
| 状态 | Zustand | 文档、选中对象、书签树、撤销栈 |
| 渲染 | pdfjs-dist | 页画布、缩略图、文本层、读取 Outline |
| 写回 | pdf-lib + @pdf-lib/fontkit | 叠加对象写入页面、嵌入 CJK 字体、写出 Outline |
| 叠加交互 | react-konva | 拖拽、缩放、选中、下一帧可见 |
| 书签拖拽 | dnd-kit | 树节点调序与嵌套 |
| 重计算 | Web Worker | pdf.js 渲染与 pdf-lib bake 离开主线程 |
| SEO | Metadata API + sitemap.ts + robots.ts | 工具落地页收录，`/editor` noindex |

## 核心功能

### 文件与查看
- **目的**: 打开本地 PDF，连续滚动、缩放、缩略图跳页
- **描述**: 文件留在会话内存。第一期视图旋转只影响显示。

### 叠加编辑
- **目的**: 在页面上加文字、图片、签名、高亮
- **描述**: 文字框可即时添加、编辑、拖拽、缩放、删除；「保存导出」把文字 bake 进 PDF 并下载 `{name}-edited.pdf`。

### 书签
- **目的**: 对标福昕书签面板的大纲导航
- **描述**: 读取原 Outline；添加、重命名、删除子树、拖拽层级、设目标位置；导出写回 `/Outlines`。

### 落地页 SEO
- **目的**: 用功能页承接搜索流量
- **描述**: `/`、`/tools/pdf-editor`、`/tools/pdf-bookmark`、`/tools/pdf-sign`、`/tools/pdf-highlight` 服务端渲染。

## 文档导航

- 当前工作区 内的 `/.monkeycode/docs/ARCHITECTURE.md` - 系统架构和技术设计
- 当前工作区 内的 `/.monkeycode/docs/INTERFACES.md` - 接口和交互规范
- 当前工作区 内的 `/.monkeycode/docs/DEVELOPER_GUIDE.md` - 开发环境和规范
- 当前工作区 内的 `/.monkeycode/specs/2026-11-07-online-pdf-editor/requirements.md` - 第一期需求
- 当前工作区 内的 `/.monkeycode/specs/2026-11-07-online-pdf-editor/design.md` - 第一期技术设计
