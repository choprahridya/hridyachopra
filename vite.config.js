import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import authoringApi from './authoring/server-plugin.js'

export default defineConfig({
  plugins: [react(), authoringApi()],
  server: {
    port: 5173,
    strictPort: false,
    // History snapshots and presets are written by the API; don't reload on them.
    watch: { ignored: ['**/authoring/history/**', '**/authoring/presets/**'] },
  },
})
