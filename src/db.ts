import { createClient } from "@libsql/client/web";
import type { AstroGlobal } from "astro";
import { drizzle } from "drizzle-orm/libsql/web";
import * as schema from "./schema";
import { getEnvVar } from "./utils";

export function createDb(astro: AstroGlobal) {
	const client = createClient({
		url: getEnvVar(astro, "TURSO_DATABASE_URL"),
		authToken: getEnvVar(astro, "TURSO_AUTH_TOKEN"),
	});

	return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDb>;
