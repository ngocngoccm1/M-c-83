import { defineConfig } from 'vite';

// GitHub Pages hosts project sites below the repository name.
// Without this base, the deployed app asks for /assets/... instead of /M-c-83/assets/....
export default defineConfig({
  base: '/M-c-83/',
  build: {
    rollupOptions: {
      input: 'app.html',
    },
  },
});
