import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig, passthroughImageService } from "astro/config";
import { codeLabel } from "./src/components/blog/codeLabel";
import { removePrettierIgnore } from "./src/components/blog/removePrettierIgnore";

// https://astro.build/config
export default defineConfig({
	site: "https://skeary.me",
	integrations: [tailwind(), mdx()],
	output: "static",
	adapter: cloudflare(),
	redirects: {
		"/portfolio": "/hello",
	},
	image: {
		service: passthroughImageService(),
	},
	markdown: {
		shikiConfig: {
			theme: "houston",
			transformers: [removePrettierIgnore, codeLabel],
		},
	},
});
