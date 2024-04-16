import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import type { PlaylistEntity, PlaylistEmbedData } from "./types/playlist";
import type { TrackEntity, TrackEmbedData } from "./types/track";
import { writeFile } from "node:fs/promises";

const playlistIdRegex = /playlistId="[^"]*"/g;
const trackIdRegex = /trackId="[^"]*"/g;

const scraper: AstroIntegration = {
	name: "spotify embed scraper",
	hooks: {
		"astro:build:start": onBuildStart,
	},
};

async function onBuildStart({ logger }: { logger: AstroIntegrationLogger }) {
	const pages = import.meta.glob("../pages/*.astro", {
		query: "?raw",
	});

	for (const path in pages) {
		const page = (await pages[path]!()) as any;
		const content = page.default as string;

		const removeQuotes = (input: string) => input.split('"')[1]!;

		const trackIds = (content.match(trackIdRegex) ?? []).map(removeQuotes);
		const playlistIds = (content.match(playlistIdRegex) ?? []).map(
			removeQuotes,
		);

		for (const trackId of trackIds) {
			try {
				const data = await scrapeData("track", trackId);
				await writeFile(
					`./src/spotify/tracks/${trackId}.json`,
					JSON.stringify(data),
				);
				logger.info(`Scraped track: ${trackId}`);
			} catch (error) {
				logger.error(
					`Failed to scrape track: ${trackId}, Error: ${error}`,
				);
			}
		}

		for (const playlistId of playlistIds) {
			try {
				const data = await scrapeData("playlist", playlistId);
				await writeFile(
					`./src/spotify/playlists/${playlistId}.json`,
					JSON.stringify(data),
				);
				logger.info(`Scraped playlist: ${playlistId}`);
			} catch (error) {
				logger.error(
					`Failed to scrape playlist: ${playlistId}, Error: ${error}`,
				);
			}
		}
	}
}

async function scrapeData(
	type: "track" | "playlist",
	id: string,
): Promise<TrackEntity | PlaylistEntity> {
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
	return data.props.pageProps.state.data.entity;
}

export default scraper;
