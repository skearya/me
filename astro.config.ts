import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
	site: "https://skeary.me",
	integrations: [db(), tailwind()],
	output: "hybrid",
	adapter: cloudflare(),
	image: {
		service: passthroughImageService(),
	},
});
