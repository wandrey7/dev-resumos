import angular from '@analogjs/vite-plugin-angular';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const currentDir = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      angular({
        tsconfig: path.resolve(currentDir, 'tsconfig.app.json'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, 'src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
