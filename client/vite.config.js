import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './client',  // Asegúrate de que esté configurado correctamente si estás trabajando en una subcarpeta
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',  // Verifica que esto esté configurado correctamente
});

