import type { Metadata } from "next";
import { EditorPageClient } from "@/components/editor/EditorPageClient";
import { editorMetadata } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: editorMetadata.title,
  description: editorMetadata.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditorPage() {
  return <EditorPageClient />;
}
