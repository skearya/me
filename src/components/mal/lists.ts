import type { AnimeListData } from "./types/anime";
import type { MangaListData } from "./types/manga";
import { olderThanDay } from "../utils";
import { db, animeList } from "astro:db";
import { mangaList } from "astro:db";

export async function getAnimeList(): Promise<
	{
		id: number;
		title: string;
		thumbnailUrl: string;
		year: number;
		score: number;
		finishDate: string | null;
	}[]
> {
	const list = await db.select().from(animeList);

	if (list[0] && !olderThanDay(list[0].lastUpdated)) {
		return list;
	} else {
		const res = await fetch(
			"https://api.myanimelist.net/v2/users/skeary/animelist?" +
				new URLSearchParams({
					fields: "list_status,start_season",
					status: "completed",
					sort: "list_score",
					limit: "100",
				}),
			{
				headers: {
					"X-MAL-CLIENT-ID": import.meta.env.MAL_CLIENT_ID,
				},
			},
		);
		const json = (await res.json()) as AnimeListData;

		const list = json.data.map((anime) => {
			return {
				id: anime.node.id,
				title: anime.node.title,
				thumbnailUrl:
					anime.node.main_picture.medium ??
					anime.node.main_picture.large,
				year: anime.node.start_season.year,
				score: anime.list_status.score,
				finishDate: anime.list_status.finish_date ?? null,
			};
		});

		await db.batch([
			db.delete(animeList),
			db.insert(animeList).values(list),
		]);

		return list;
	}
}

export async function getMangaList(): Promise<
	{
		id: number;
		title: string;
		score: number;
		thumbnailUrl: string;
		finishDate: string | null;
	}[]
> {
	const list = await db.select().from(mangaList);

	if (list[0] && !olderThanDay(list[0].lastUpdated)) {
		return list;
	} else {
		const res = await fetch(
			"https://api.myanimelist.net/v2/users/skeary/mangalist?" +
				new URLSearchParams({
					fields: "list_status",
					status: "completed",
					sort: "list_score",
					limit: "100",
				}),
			{
				headers: {
					"X-MAL-CLIENT-ID": import.meta.env.MAL_CLIENT_ID,
				},
			},
		);
		const json = (await res.json()) as MangaListData;

		const list = json.data.map((anime) => {
			return {
				id: anime.node.id,
				title: anime.node.title,
				thumbnailUrl:
					anime.node.main_picture.medium ??
					anime.node.main_picture.large,
				score: anime.list_status.score,
				finishDate: anime.list_status.finish_date ?? null,
			};
		});

		await db.batch([
			db.delete(mangaList),
			db.insert(mangaList).values(list),
		]);

		return list;
	}
}
