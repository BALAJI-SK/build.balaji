import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'charts': ['recharts'],
          'particles': ['@tsparticles/react', '@tsparticles/engine', '@tsparticles/preset-links'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
