import type { AstroIntegration } from "astro";
import { writeFile } from "node:fs/promises";

const scraper: AstroIntegration = {
	name: "spotify embed scraper",
	hooks: {
		"astro:build:start": async ({ logger }) => {
			const pages = import.meta.glob("../pages/*.astro", {
				query: "?raw",
			});

			for (const path in pages) {
				const page = (await pages[path]!()) as any;
				const content = page.default as string;

				if (content.find("playlist id =")) {

				}
			}

			await writeFile(
				"./src/spotify/playlists/playlistData.json",
				JSON.stringify({ a: "b" }),
			);
			logger.info("wrote file");
		},
	},
};

export default scraper;
