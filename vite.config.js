import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Own port, so it never collides with the Alkebulan site (5173).
  // If 5174 is already taken (e.g. the site is running in another
  // terminal), Vite uses the next free port instead of stopping with
  // "Port 5174 is already in use", and opens the browser at it.
  server: {
    port: 5174,
    strictPort: false,
    open: true,
  },
})
