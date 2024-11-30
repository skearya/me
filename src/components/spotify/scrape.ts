import type { TrackEntity, TrackEmbedData } from "./types/track";
import type { PlaylistEntity, PlaylistEmbedData } from "./types/playlist";
import type { AlbumEmbedData, AlbumEntity } from "./types/album";
import { getCache, olderThanDay } from "../utils";
import { db, eq, cache } from "astro:db";

export type Track = {
	id: string;
	title: string;
	artist: string;
	coverUrl: string;
	audioPreview: string | null;
	color: string;
};

export type AlbumOrPlaylist = {
	id: string;
	name: string;
	thumbnailUrl: string;
	color: string;
	tracks: {
		id: string;
		title: string;
		artist: string;
		audioPreview: string | null;
	}[];
};

const getSpotifyId = (url: string) => url.split("/").at(-1)!.split("?")[0]!;

export async function getTrack(url: string): Promise<Track> {
	const id = `spotify:track:${getSpotifyId(url)}`;

	const track = await getCache<Track>(id);

	if (track) {
		return track.data;
	} else {
		const track = await scrapeItem("track", id).then((data) =>
			mapTrackEmbed(data),
		);

		await db.insert(cache).values({ id, data: track });

		return track;
	}
}

export async function getAlbumOrPlaylist(
	url: string,
): Promise<AlbumOrPlaylist | undefined> {
	const type = url.includes("album") ? "album" : "playlist";
	const id = `spotify:${type}:${getSpotifyId(url)}`;

	const item = await getCache<AlbumOrPlaylist>(id);

	const albumOrPlaylist = async () => {
		const item = await scrapeItem(type, id).then((data) =>
			mapAlbumOrPlaylistEmbed(data),
		);

		await db.batch([
			db.delete(cache).where(eq(cache.id, id)),
			db.insert(cache).values({ id, data: item }),
		]);

		return item;
	};

	if (item) {
		if (type === "playlist" && olderThanDay(item.lastUpdated)) {
			try {
				return albumOrPlaylist();
			} catch {
				return item.data;
			}
		}

		return item.data;
	} else {
		return albumOrPlaylist();
	}
}

async function scrapeItem<T extends "track" | "album" | "playlist">(
	type: T,
	dbId: string,
): Promise<
	T extends "track"
		? TrackEntity
		: T extends "album"
			? AlbumEntity
			: PlaylistEntity
> {
	const id = dbId.split(":").at(-1)!;

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
	const data: TrackEmbedData | AlbumEmbedData | PlaylistEmbedData =
		JSON.parse(json);

	return data.props.pageProps.state.data.entity as T extends "track"
		? TrackEntity
		: T extends "album"
			? AlbumEntity
			: PlaylistEntity;
}

function mapTrackEmbed(track: TrackEntity): Track {
	return {
		id: track.id,
		title: track.name,
		artist: track.artists.map((artist) => artist.name).join(", "),
		color: track.coverArt.extractedColors.colorDark.hex ?? "#000000",
		coverUrl: track.coverArt.sources[0]!.url,
		audioPreview: track.audioPreview?.url ?? null,
	};
}

function mapAlbumOrPlaylistEmbed(
	data: AlbumEntity | PlaylistEntity,
): AlbumOrPlaylist {
	return {
		id: data.id,
		name: data.name,
		thumbnailUrl:
			data.visualIdentity.image[0]?.url ?? data.coverArt?.sources[0]?.url,
		color: `rgba(${data.visualIdentity.backgroundBase.red}, ${data.visualIdentity.backgroundBase.green}, ${data.visualIdentity.backgroundBase.blue}, ${data.visualIdentity.backgroundBase.alpha})`,
		tracks: data.trackList.map((track) => {
			return {
				id: track.uri.split(":").at(-1)!,
				title: track.title,
				artist: track.subtitle,
				audioPreview: track.audioPreview?.url ?? null,
			};
		}),
	};
}
