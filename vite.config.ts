import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    // 1. Rulam pluginul vinext primul pentru a mapa structura Next.js (app/)
    vinext(),
    // 2. Configuram pluginul Cloudflare cu setarile specifice de RSC
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr", "client"], // Lipsa mediului "client" bloca maparea rutei dev catre browser!
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  // Fortam Vite sa asculte si sa serveasca corect fisierele din radacina
  server: {
    fs: {
      allow: ["."],
    },
  },
});
