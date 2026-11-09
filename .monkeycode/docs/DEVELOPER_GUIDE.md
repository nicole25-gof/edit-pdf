# 开发指南

## 环境要求

- Node.js 20+
- npm（本环境包安装使用 `npm install -g` 全局方式时遵循平台规则；项目依赖写在 `package.json`）
- 现代桌面浏览器（Chromium / Firefox / Safari 近两个大版本）

## 快速开始

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 类型检查
npm run typecheck

# 单测
npm test

# e2e
npm run test:e2e
```

开发服务器需允许 `*.monkeycode-ai.online`（Next.js `allowedHosts`）。预览只暴露一个端口：落地页与编辑器同进程，第一期无独立后端。

## 项目结构说明

- `app/`：路由。落地页 RSC；`app/editor/page.tsx` 挂载客户端工作台。
- `components/landing/`：营销块。
- `components/editor/`：工作台、工具栏、页台、文字框叠加层。
- `lib/pdf/`：坐标转换（`pageMetrics`）、叠加模型（`overlay`）、pdf.js 打开。
- `lib/store/`：Zustand 文档状态。
- `lib/seo/`：各落地页 title / description 常量。
- `public/cmaps/`：pdf.js CMap。
- `public/fonts/`：Noto 字体，bake 时读取。

规格原文：

- 当前工作区 内的 `/.monkeycode/specs/2026-11-07-online-pdf-editor/requirements.md`
- 当前工作区 内的 `/.monkeycode/specs/2026-11-07-online-pdf-editor/design.md`

## 开发规范

- 语言：TypeScript strict。
- 组件：函数组件。编辑器交互组件加 `'use client'`。
- 命名：React 组件 PascalCase；命令与工具函数 camelCase；PDF 用户空间变量用 `pdfX` / `cssX` 前缀避免混用。
- 叠加对象与书签的变更只走 store 命令，页台不直接改 PDF 字节。
- 大 ArrayBuffer 在 Worker 间 transfer，避免 structured clone。
- 提交信息：`feat:` / `fix:` / `docs:` / `chore:` 前缀。

## 常见任务

### 加一种叠加对象

1. 在 Data Model 加类型
2. 在 OverlayLayer 加 Konva 节点
3. 在 bakeWorker 加绘制
4. 补撤销与单测

### 改书签行为

1. 改 `lib/pdf/outline.ts` 的树操作
2. 改 BookmarkPanel 交互
3. 用 `outline-nested.pdf` 做读写往返测试

### 加一条落地页

1. `app/tools/<slug>/page.tsx` 导出 `metadata`
2. 写入 `app/sitemap.ts`
3. 文案放 `lib/seo/metadata.ts`

## 构建与发布

```bash
npm run build
npm run start
```

第一期构建产物是 Next.js Web 应用。本地预览走平台 `deploy-website` 流程，编辑器与落地页共用同一端口。

## 测试夹具

放在 `tests/fixtures/`：

- `blank-a4.pdf`
- `outline-nested.pdf`
- `scanned-image-page.pdf`
- `cjk-text.pdf`
