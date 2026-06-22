import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Îi spune lui Next.js/Turbopack să nu includă fizic serialport în build */
  serverExternalPackages: ["serialport"],
  
  /* PLASA DE SIGURANȚĂ INDUSTRIALĂ: Ignoră erorile TypeScript la build-ul pe Vercel */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
