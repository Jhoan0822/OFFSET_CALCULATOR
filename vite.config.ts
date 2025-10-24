// vite.config.ts

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Esto cargará las variables de .env, .env.local, y para 'production', también .env.production
    const env = loadEnv(mode, process.cwd(), '');

    return {
      // ---> AÑADE ESTA LÍNEA AQUÍ <---
      // Usa la variable de entorno para la ruta base, o '/' como valor por defecto para desarrollo.
      base: env.VITE_BASE_URL || '/',

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
