import { defineConfig } from 'vite';

// Relative base so dist/ opens from any host or sub-folder.
export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0 },
});
