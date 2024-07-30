import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

export default defineConfig({
  plugins: [
    sveltekit(),
    // dynamicImportVars({
    //   // Adjust this include pattern based on where your dynamic components are located
    //   include: 'src/components/**',
    //   // You can add exclude patterns if needed
    //   // exclude: 'node_modules/**'
    // }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
