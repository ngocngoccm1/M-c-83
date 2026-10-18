import { defineConfig } from 'vite';

// Relative asset paths work under the GitHub Pages project path and at a site root.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: 'app.html',
    },
  },
});
