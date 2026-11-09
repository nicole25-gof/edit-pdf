import type { Metadata } from "next";
import Link from "next/link";
import { homeMetadata } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: { absolute: homeMetadata.title },
  description: homeMetadata.description,
  openGraph: {
    title: homeMetadata.title,
    description: homeMetadata.description,
    type: "website",
  },
};

const features = [
  {
    title: "文字与图片",
    body: "在页面上添加文字框和图片，拖拽即可调整，当前页立刻看见结果。",
  },
  {
    title: "签名与高亮",
    body: "手写或图片签名，四色高亮批注，导出后仍保留在 PDF 里。",
  },
  {
    title: "福昕风格书签",
    body: "多级书签树：添加、重命名、嵌套、跳转，写出后可用福昕打开。",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight">Edit PDF</span>
          <Link
            href="/editor"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            开始编辑
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-accent">浏览器内 PDF 工具</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
            在线 PDF 编辑器
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            打开本地 PDF，添加文字、图片、签名与高亮，编辑结果立即显示在当前页。文件留在浏览器会话，不上传到服务器。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
            >
              开始编辑
            </Link>
            <Link
              href="/editor"
              className="rounded-md border border-line bg-panel px-5 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              打开编辑器
            </Link>
          </div>
        </section>
        <section className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-line bg-panel p-5"
            >
              <h2 className="text-base font-semibold text-stone-900">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {feature.body}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
