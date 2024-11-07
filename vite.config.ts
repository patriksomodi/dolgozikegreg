import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
 
export default defineConfig({
  plugins: [react(),viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
