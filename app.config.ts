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
        overlay: true, // Afficher les erreurs HMR
      },
      watch: {
        usePolling: true,
        interval: 100, // Polling plus rapide
      },
    },
    // Force le rechargement complet pour les CSS
    css: {
      devSourcemap: true,
    },
  },
  server: { preset: "vercel" },
});
