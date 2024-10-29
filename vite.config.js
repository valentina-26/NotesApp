// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import fs from 'fs';

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');

export default defineConfig({
  root: join(__dirname, 'client'),
  plugins: [vue()],
  build: {
    base:'https://valentina-26.github.io/NotesApp/',
    outDir: join(__dirname, 'client/dist'),
    emptyOutDir: true
  },
  server: {
    https: {
      key: privateKey,
      cert: certificate,
    },
    host: 'localhost',
    port: 5011,
    proxy: {
      '/users': {
        target: 'https://localhost:5011',
        secure: false,
        rewrite: (path) => path.replace(/^\/users/, '')
      },
      '/notes': {
        target: 'https://localhost:5011',
        secure: false,
        rewrite: (path) => path.replace(/^\/notes/, '')
      }
    }
  }
});
