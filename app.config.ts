import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(), 
    ],
    server: {
      hmr: {
        protocol: 'wss',
        clientPort: 443,
      },
      watch: {
        usePolling: true,
      },
    },
  },
  server: { preset: "vercel" },
});
