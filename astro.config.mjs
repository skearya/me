import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
// import cloudflare from "@astrojs/cloudflare";
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "hybrid",
  // adapter: cloudflare(),
  adapter: node({
    mode: 'standalone'
  }),
  image: {
    service: passthroughImageService()
  }
});