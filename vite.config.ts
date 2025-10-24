import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true, // 允许外部访问
    open: true
  },
  optimizeDeps: {
    exclude: ['@supabase/supabase-js']
  },
  build: {
    commonjsOptions: {
      exclude: ['@supabase/supabase-js'],
      include: []
    }
  }
})