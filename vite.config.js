// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ¡IMPORTANTE! Cambia '<TU_REPOSITORIO>' por el nombre de tu repo.
  // Por ejemplo, si tu repo es 'cotizador-offset', la línea sería: base: '/cotizador-offset/',
  base: '/<OFFSET_CALCULATOR>/', 
});