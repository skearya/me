import { defineConfig, passthroughImageService } from "astro/config";
import scraper from "./src/spotify/scraper";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
// import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: "https://skeary.me",
	integrations: [scraper, tailwind()],
	output: "hybrid",
	adapter: cloudflare(),
	// adapter: node({
		// mode: "standalone",
	// }),
	image: {
		service: passthroughImageService(),
	},
});
