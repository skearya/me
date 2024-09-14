import type { AstroGlobal } from "astro";

export function olderThanDay(date: Date): boolean {
	const dayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
	return date <= dayAgo;
}

export function getEnvVar(Astro: AstroGlobal, envVar: string): string {
	return Astro.locals.runtime.env[envVar] ?? import.meta.env[envVar];
}
