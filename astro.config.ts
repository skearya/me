import { defineConfig, passthroughImageService } from "astro/config";
import scraper from "./src/spotify/scraper";
import tailwind from "@astrojs/tailwind";
// import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
	site: "https://skeary.me",
	integrations: [db(), tailwind(), scraper],
	output: "server",
	adapter: cloudflare(),
	image: {
		service: passthroughImageService(),
	},
});
