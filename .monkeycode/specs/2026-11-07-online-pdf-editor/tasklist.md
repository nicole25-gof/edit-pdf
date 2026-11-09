# 需求实施计划

按可演示增量逐个交付。完成一项、可预览后停下，再做下一项。

- [x] 1. 项目骨架与首页落地页
  - 初始化 Next.js 15 App Router + TypeScript + Tailwind
  - 配置 `allowedHosts` 含 `.monkeycode-ai.online`
  - 实现 `/` 服务端渲染首页：title、description、H1、开始编辑 CTA
  - 实现 `app/robots.ts` 与 `app/sitemap.ts`
  - `/editor` 先放空状态占位（打开/拖入提示，暂不解析 PDF）
  - 对应 Requirement 11、Requirement 10.4

- [x] 2. 检查点 - 首页可预览
  - 确保开发服务器可打开首页，如有疑问请询问用户

- [ ] 3. SEO 工具落地页
  - 实现 `/tools/pdf-editor`、`/tools/pdf-bookmark`、`/tools/pdf-sign`、`/tools/pdf-highlight`
  - 每页独立 title、description、H1，CTA 进入 `/editor`
  - `/editor` 输出 `noindex`
  - 对应 Requirement 11

- [ ] 4. 编辑器工作台壳
  - Ribbon 分组：File、View、Edit、Comment、Fill and Sign、Bookmark
  - 左栏切换：缩略图 / 书签 / 注释
  - 状态栏：页码、总页、缩放
  - 无文档时显示打开/拖入空状态
  - 对应 Requirement 10

- [x] 5. 打开 PDF 并渲染预览
  - pdf.js Worker：加载本地 PDF、按页渲染、连续滚动
  - 显示页码与总页数
  - 损坏/非 PDF 错误提示
  - 关闭文档清空会话
  - 对应 Requirement 1、Requirement 2.1、Requirement 2.2、Requirement 2.8、Requirement 12

- [ ] 6. 查看：缩放、跳页、缩略图、视图旋转
  - 适合页宽 / 适合页面 / 25%–400%
  - 框选放大
  - 首页/末页、输入页码跳转
  - 左侧缩略图点击跳页
  - 视图旋转 90 度（仅显示）
  - 对应 Requirement 2

- [x] 7. 文字框叠加（即时可见）
  - 点击落点创建文字框并进入编辑
  - 字体/字号/颜色/对齐
  - 拖拽、缩放、删除，下一帧可见
  - 对应 Requirement 3、Requirement 8.1

- [ ] 8. 图片叠加
  - 插入 PNG/JPEG，宽不超过页宽 50%，保持比例
  - 拖拽、等比缩放、删除
  - 超 10 MB 或类型错误提示
  - 对应 Requirement 4

- [ ] 9. 签名
  - 手写画板与图片签名，写入会话签名列表
  - 放置、复用、拖拽、等比缩放、删除
  - 对应 Requirement 5

- [ ] 10. 高亮注释
  - 拖框高亮，四色，40% 透明
  - 删除；左栏注释列表点击定位
  - 对应 Requirement 6

- [ ] 11. 书签面板
  - 读取原 Outline 树
  - 添加（当前页 / 选中文本作标题）、重命名、删除子树
  - 拖拽调序与嵌套、展开/折叠、设目标位置、点击跳转
  - 对应 Requirement 7.1–7.10

- [ ] 12. 撤销重做
  - 叠加与书签变更进入 50 步历史
  - Undo / Redo；新变更清空 redo
  - 对应 Requirement 9

- [x] 13. 导出 bake 与书签写回
  - pdf-lib 写入文字并 embed Noto（图片/签名/书签后续补）
  - 下载 `{name}-edited.pdf`
  - bake 成功后用新字节刷新预览
  - 对应 Requirement 8、Requirement 12

- [ ] 14. 检查点 - 第一期主路径可演示
  - 确保打开、叠加、书签、导出主路径可跑通，如有疑问请询问用户
