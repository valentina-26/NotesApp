import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';

export default defineConfig({
  root: join(__dirname, 'client'),
  base: '/NotesApp/',
  plugins: [vue()],
  build: {
    outDir: join(__dirname, 'client/dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'client/src'),
    },
  },
});