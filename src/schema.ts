import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const cache = sqliteTable("cache", {
	id: text().primaryKey(),
	data: text({ mode: "json" }),
	lastUpdated: text().default(sql`(CURRENT_TIMESTAMP)`),
});
