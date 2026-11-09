# User Instruction Memory

This file records user instructions, preferences, and teachings for reference in future interactions.

## Format

### User Instruction Entry
User instruction entries should follow this format:

[User Instruction Summary]
- Date: [YYYY-MM-DD]
- Context: [Mentioned scenario or time]
- Instructions:
  - [Content of user teaching or instruction, described line by line]

### Project Knowledge Entry
Entries discovered by the Agent during task execution should follow this format:

[Project Knowledge Summary]
- Date: [YYYY-MM-DD]
- Context: Discovered by Agent while performing [specific task description]
- Category: [Operations & Deployment|Build Methods|Testing Methods|Troubleshooting & Debugging|Workflow & Collaboration|Environment Configuration]
- Instructions:
  - [Specific knowledge points, described line by line]

## Deduplication Strategy
- Before adding a new entry, check for similar or identical instructions.
- If a duplicate is found, skip the new entry or merge it with the existing one.
- When merging, update the context or date information.
- This helps avoid redundant entries and keeps the memory file tidy.

## Entries

[Incremental feature delivery]
- Date: 2026-11-07
- Context: User confirmed the PDF editor stack and asked to start implementation against the GitHub repo
- Instructions:
  - Deliver one feature at a time as a complete, demoable increment
  - Finish, show, and wait before starting the next feature
  - Do not implement the full editor in one batch

[GitHub remote]
- Date: 2026-11-07
- Context: User provided the existing repository URL after docs were committed locally
- Category: Operations & Deployment
- Instructions:
  - Project remote is https://github.com/nicole25-gof/edit-pdf.git

[Node.js runtime]
- Date: 2026-11-07
- Context: Discovered by Agent while scaffolding Next.js 16
- Category: Environment Configuration
- Instructions:
  - Next.js 16 requires Node.js >= 20.9; Debian apt `nodejs` is 18.x and cannot run create-next-app@latest
  - Node 20.19.5 is installed to `/usr/local` from npmmirror linux-x64 tarball (20.18.x cannot `require()` ESM packages such as magic-string)
  - Tailwind v4 in this project uses `@tailwindcss/postcss` + `postcss.config.mjs`; `@tailwindcss/turbopack` hits ESM/CJS errors under Turbopack
  - `npm install` in this environment is slow; npm registry can use `https://registry.npmmirror.com`
  - Dev server: `npm run dev` on port 3000
  - pdf.js worker is served from `/pdf.worker.min.mjs`; cmaps at `/cmaps/`; standard fonts at `/standard_fonts/`
  - pdfjs-dist must be dynamically imported on the client only; SSR hits `DOMMatrix is not defined`
  - Zustand selectors must return a stable reference; filtering overlays inside `useDocumentStore(...)` recreates arrays and triggers React 19 `getSnapshot should be cached`
  - Do not wrap `/editor` with `next/dynamic({ ssr: false })`; under Next 16 + Cache Components it stays on "正在加载编辑器…"
  - `allowedDevOrigins` must include the current preview host (e.g. `*.monkeycode-ai.online`); a leading-dot entry alone is blocked by Next HMR
