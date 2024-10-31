// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import fs from 'fs';

// Cargar certificado y clave privada
// const privateKey = fs.readFileSync('./private.key');
// const certificate = fs.readFileSync('./certificate.crt');

export default defineConfig({
  root: join(__dirname, 'client'),
  plugins: [vue()],
  build: {
    base: 'https://valentina-26.github.io/NotesApp/',
    outDir: join(__dirname, 'client/dist'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
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
