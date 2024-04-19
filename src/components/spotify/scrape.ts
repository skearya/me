import type { TrackEntity, TrackEmbedData } from "./types/track";
import type { PlaylistEntity, PlaylistEmbedData } from "./types/playlist";
import { db, playlists, playlistItems, eq, tracks } from "astro:db";

export async function getTrack(url: string): Promise<{
	id: string;
	title: string;
	artist: string;
	coverUrl: string;
	audioPreview: string | null;
	color: string;
}> {
	const id = url.split("/").at(-1)!.split("?")[0]!;

	const track = (await db.select().from(tracks).where(eq(tracks.id, id)))[0];

	if (track) {
		return track;
	} else {
		console.log(`embed-scraper: cache miss, scraping ${id}`);

		const track = await scrapeItem("track", id).then((data) =>
			mapTrackEmbed(data),
		);

		await db.insert(tracks).values(track);

		return track;
	}
}

export async function getPlaylist(url: string): Promise<
	[
		{
			id: string;
			color: string;
			name: string;
			thumbnailUrl: string;
			lastUpdated?: Date;
		},
		{
			playlistId: string;
			title: string;
			artist: string;
			audioPreview: string | null;
		}[],
	]
> {
	const id = url.split("/").at(-1)!.split("?")[0]!;

	const playlistData = await db
		.select()
		.from(playlists)
		.where(eq(playlists.id, id))
		.leftJoin(playlistItems, eq(playlists.id, playlistItems.playlistId));

	const playlist = playlistData[0]?.playlists;
	const items = playlistData.map((data) => data.playlistItems!);

	if (playlist && !olderThanDay(playlist.lastUpdated)) {
		return [playlist, items];
	} else {
		console.log(`embed-scraper: cache miss, scraping ${id}`);

		const [playlist, items] = await scrapeItem("playlist", id).then(
			(data) => mapPlaylistEmbed(data),
		);

		await db.batch([
			db.delete(playlistItems).where(eq(playlistItems.playlistId, id)),
			db.delete(playlists).where(eq(playlists.id, id)),
			db.insert(playlists).values(playlist),
			db.insert(playlistItems).values(items),
		]);

		return [playlist, items];
	}
}

function olderThanDay(date: Date): boolean {
	const dayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
	return date <= dayAgo;
}

async function scrapeItem<T extends "track" | "playlist">(
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
		cache: "no-store",
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

function mapTrackEmbed(track: TrackEntity): {
	id: string;
	title: string;
	artist: string;
	color: string;
	coverUrl: string;
	audioPreview: string | null;
} {
	return {
		id: track.id,
		title: track.name,
		artist: track.artists.map((artist) => artist.name).join(", "),
		color: track.coverArt.extractedColors.colorDark.hex ?? "#000000",
		coverUrl: track.coverArt.sources[0]!.url,
		audioPreview: track.audioPreview?.url ?? null,
	};
}

function mapPlaylistEmbed(playlist: PlaylistEntity): [
	{
		id: string;
		name: string;
		thumbnailUrl: string;
		color: string;
	},
	{
		playlistId: string;
		title: string;
		artist: string;
		audioPreview: string | null;
	}[],
] {
	const data = {
		id: playlist.id,
		name: playlist.name,
		thumbnailUrl: playlist.coverArt.sources[0]!.url,
		color: playlist.coverArt.extractedColors.colorDark.hex ?? "#000000",
	};

	const items = playlist.trackList.map((track) => {
		return {
			playlistId: playlist.id,
			title: track.title,
			artist: track.subtitle,
			audioPreview: track.audioPreview?.url ?? null,
		};
	});

	return [data, items];
}
