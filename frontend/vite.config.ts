import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Pages from 'vite-plugin-pages'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  envDir: 'envs',
  envPrefix: 'CCRAWLER__',
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),

    Pages({
      // ℹ️ We need three routes using single routes so we will ignore generating route for this SFC file
      onRoutesGenerated: routes => {
        return [
          ...routes,
        ]
      },
      exclude: [
        '**/*_deprecated.vue', // Exclude Vue files with "_deprecated" in their names, https://github.com/hannoeru/vite-plugin-pages#extensions
        '**/components/*.vue',
      ],
    }),
    Components({
      dirs: ['src/@core/components'],
      dts: true,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      vueTemplate: true,
    }),
  ],

  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // every chunk should not exceed more than 5MB
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
  },
})
