import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.monkeycode-ai.online",
    ".monkeycode-ai.online",
    "3000-55bc910b6b50aa9a.monkeycode-ai.online",
  ],
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["pdfjs-dist", "pdf-lib", "@pdf-lib/fontkit"],
};

export default nextConfig;
