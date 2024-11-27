import type { AnimeListData } from "./types/anime";
import type { MangaListData } from "./types/manga";
import { getCache, olderThanDay } from "../utils";
import { db, eq, cache } from "astro:db";

export type MalList = {
	id: number;
	title: string;
	thumbnailUrl: string;
	year: number | undefined;
	score: number;
	finishDate: string | null;
}[];

export async function fetchList(
	MAL_CLIENT_ID: string,
	type: "anime" | "manga",
): Promise<MalList> {
	const res = await fetch(
		`https://api.myanimelist.net/v2/users/skeary/${type}list?` +
			new URLSearchParams({
				fields:
					type === "anime"
						? "list_status,start_season"
						: "list_status",
				status: "completed",
				sort: "list_score",
				limit: "100",
			}),
		{
			headers: {
				"X-MAL-CLIENT-ID": MAL_CLIENT_ID,
			},
		},
	);

	const json = (await res.json()) as AnimeListData | MangaListData;

	return json.data.map((item) => {
		return {
			id: item.node.id,
			title: item.node.title,
			thumbnailUrl:
				item.node.main_picture.medium ?? item.node.main_picture.large,
			// @ts-expect-error
			year: item.node?.start_season?.year as number | undefined,
			score: item.list_status.score,
			finishDate: item.list_status.finish_date ?? null,
		};
	});
}

export async function getMalList(
	MAL_CLIENT_ID: string,
	type: "anime" | "manga",
): Promise<MalList | undefined> {
	const list = await getCache<MalList>(`mal:${type}`);

	if (list) {
		if (olderThanDay(list.lastUpdated)) {
			try {
				const list = await fetchList(MAL_CLIENT_ID, type);

				await db.batch([
					db.delete(cache).where(eq(cache.id, `mal:${type}`)),
					db.insert(cache).values({ id: `mal:${type}`, data: list }),
				]);

				return list;
			} catch {
				return list.data;
			}
		}

		return list.data;
	}

	return undefined;
}
