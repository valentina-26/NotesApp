import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';

export default defineConfig({
  root: join(__dirname, 'client'),
  base: '/NotesApp/',  // Cambiado de https://... a /NotesApp/
  plugins: [vue()],
  build: {
    outDir: join(__dirname, './client/dist'), // Cambiado para generar dist en la raíz
    emptyOutDir: true,
    rollupOptions: {
      output: {
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