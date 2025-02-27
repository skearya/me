import type { AstroGlobal } from "astro";
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";
import { getEnvVar } from "./utils";
import * as schema from "./schema";

export function createDb(astro: AstroGlobal) {
	const client = createClient({
		url: getEnvVar(astro, "TURSO_DATABASE_URL"),
		authToken: getEnvVar(astro, "TURSO_AUTH_TOKEN"),
	});

	return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDb>;
