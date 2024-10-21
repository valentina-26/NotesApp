import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import fs from 'fs';

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');

export default defineConfig({
  root: join(__dirname, 'client'), // Carpeta de frontend
  plugins: [vue()],
  build: {
    outDir: join(__dirname, 'client/dist'), // Carpeta de salida del build
    emptyOutDir: true
  },
  server: {
    https: {
      key: privateKey,
      cert: certificate,
    },
    host: 'localhost',
    port: 3000, // Puerto que deseas usar
  }
});
