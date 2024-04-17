import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
import type { PlaylistEntity, PlaylistEmbedData } from "./types/playlist";
import type { TrackEntity, TrackEmbedData } from "./types/track";
import { readdir, readFile } from "node:fs/promises";

const playlistIdRegex = /playlistId="[^"]*"/g;
const trackIdRegex = /trackId="[^"]*"/g;
const virtualModuleId = "virtual:spotify-data";

const onConfigSetup: AstroIntegration["hooks"]["astro:config:setup"] = async ({
	logger,
	isRestart,
	updateConfig,
}) => {
	if (isRestart) return;

	const pages = await readdir("./src/pages", { recursive: true });

	const trackData: Record<string, TrackEntity> = {};
	const playlistData: Record<string, PlaylistEntity> = {};

	for (const page of pages) {
		const content = await readFile("./src/pages/" + page, {
			encoding: "utf8",
		});

		const items = collectIds(content);

		for (const { type, id } of items) {
			try {
				if (type === "track") {
					trackData[id] = await scrapeData("track", id);
				} else {
					playlistData[id] = await scrapeData("playlist", id);
				}

				logger.info(`scraped ${id}`);
			} catch (error) {
				logger.error(`failed to scrape ${id}, ${error}`);
			}
		}
	}

	const vitePlugin: Plugin = {
		name: "spotify-embed-scraper",
		resolveId(id) {
			if (id.startsWith(virtualModuleId)) {
				return "\0" + id;
			}

			return undefined;
		},
		load(id) {
			if (id.startsWith("\0" + virtualModuleId)) {
				const type = id.split("/")[1] as "tracks" | "playlists";

				if (type === "tracks") {
					return `export default ${JSON.stringify(trackData)}`;
				} else {
					return `export default ${JSON.stringify(playlistData)}`;
				}
			}

			return undefined;
		},
	};

	updateConfig({
		vite: {
			plugins: [vitePlugin],
		},
	});
};

function collectIds(page: string): Array<{ type: string; id: string }> {
	const ids = [];

	const removeQuotes = (input: string) => input.split('"')[1]!;

	ids.push(
		...(page.match(trackIdRegex) ?? []).map((id) => {
			return { type: "track", id: removeQuotes(id) };
		}),
	);
	ids.push(
		...(page.match(playlistIdRegex) ?? []).map((id) => {
			return { type: "playlist", id: removeQuotes(id) };
		}),
	);

	return ids;
}

async function scrapeData<T extends "track" | "playlist">(
	type: T,
	id: string,
): Promise<T extends "track" ? TrackEntity : PlaylistEntity> {
	const res = await fetch(`https://open.spotify.com/embed/${type}/${id}`, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Upgrade-Insecure-Requests": "1",
			"Sec-Fetch-Dest": "iframe",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-Site": "cross-site",
			Pragma: "no-cache",
			"Cache-Control": "no-cache",
		},
		method: "GET",
	});

	const html = await res.text();

	const json = html.substring(
		html.lastIndexOf(`type="application/json">`) +
			`type="application/json">`.length,
		html.lastIndexOf(`</script>`),
	);

	const data: TrackEmbedData | PlaylistEmbedData = JSON.parse(json);
	return data.props.pageProps.state.data.entity as T extends "track"
		? TrackEntity
		: PlaylistEntity;
}

const scraper: AstroIntegration = {
	name: "spotify-embed-scraper",
	hooks: {
		"astro:config:setup": onConfigSetup,
	},
};

export default scraper;
