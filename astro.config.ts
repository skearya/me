import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://skeary.me",
	integrations: [db(), tailwind(), mdx()],
	output: "hybrid",
	adapter: cloudflare(),
	image: {
		service: passthroughImageService(),
	},
});
