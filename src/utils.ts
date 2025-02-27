import type { AstroGlobal } from "astro";
import type { Database } from "./db";
import { cache } from "./schema";
import { eq } from "drizzle-orm";

export async function getCache<T>(
	db: Database,
	id: string,
): Promise<{ id: string; data: T; lastUpdated: Date } | undefined> {
	// @ts-expect-error
	return (await db.select().from(cache).where(eq(cache.id, id)))[0];
}

export function olderThanDay(date: Date): boolean {
	const dayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
	return date <= dayAgo;
}

export function getEnvVar(Astro: AstroGlobal, envVar: string): string {
	return Astro.locals.runtime.env[envVar] ?? import.meta.env[envVar];
}
