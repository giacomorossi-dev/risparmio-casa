import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  // I pacchetti Clerk importano il modulo CJS use-sync-external-store/shim
  // (tramite @clerk/shared). Forzando il pre-bundling di @clerk/tanstack-react-start,
  // esbuild inlina il CJS con l'interop corretto; senza, Vite serve lo shim raw
  // e il client si rompe con "does not provide an export named useSyncExternalStore".
  optimizeDeps: {
    include: [
      '@clerk/tanstack-react-start',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/with-selector',
    ],
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact(), nitro()],
});
