import { defineConfig } from 'vitest/config';
process.loadEnvFile('.env');

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Todos los archivos de test comparten la misma base de datos y cada uno ejecuta el seed,
    // asi que no pueden correr en paralelo.
    fileParallelism: false,
  },
});