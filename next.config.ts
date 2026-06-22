import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Îi spune lui Turbopack și Next.js să ruleze serialport direct pe PC-ul local */
  serverExternalPackages: ["serialport"],
};

export default nextConfig;
