import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },

  //? not working
  plugins: [tailwindcss()],
  css: {
    transformer: 'lightningcss',
  },
  optimizeDeps: {
    // Pre-bundle these lodash functions for better performance
    include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep'],
  },
  build: {
    // Generate source maps in production for better error tracking
    sourcemap: true,
  },
}

export default config
