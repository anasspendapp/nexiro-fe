import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      // Optimize build for SEO and performance
      outDir: "dist",
      assetsDir: "assets",
      minify: "terser",
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          // Code splitting strategy for better caching
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "google-vendor": ["@react-oauth/google"],
            "query-vendor": ["@tanstack/react-query"],
          },
        },
      },
      // Terser options for better compression
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },
    },
  };
});
