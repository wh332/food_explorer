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
    include: ['@supabase/supabase-js']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true
    },
    rollupOptions: {
      external: [],
      plugins: []
    }
  }
})