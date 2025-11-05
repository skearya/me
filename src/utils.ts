import type { AstroGlobal } from "astro";
import { eq } from "drizzle-orm";
import type { Database } from "./db";
import { projects, stack } from "./projects.json";
import { cache } from "./schema";

export type Project = {
	name: string;
	description: string;
	thumbnail: string;
	stack: Array<{ name: string; url: string; icon: string }>;
	repo?: string;
	url?: string;
};

export function getProjects() {
	const projectImgExt = (name: string) => {
		const overrides: Record<string, string> = { patchwork: "gif" };
		return overrides[name] ?? "png";
	};

	const stackImgExt = (name: string) => {
		const overrides: Record<string, string> = { raylib: "png" };
		return overrides[name] ?? "svg";
	};

	const entries = Object.entries(projects).map(
		([year, projects]) =>
			[
				parseInt(year),
				projects.map(
					(project) =>
						({
							...project,
							thumbnail: `/projects/${project.name}.${projectImgExt(project.name)}`,
							stack: project.stack.map((name) => ({
								name,
								url: stack[name as keyof typeof stack],
								icon: `/stack/${name}.${stackImgExt(name)}`,
							})),
						}) as Project,
				),
			] as const,
	);

	return entries.sort(([a], [b]) => b - a);
}

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
