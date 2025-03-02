import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cache = sqliteTable("cache", {
	id: text().primaryKey(),
	data: text({ mode: "json" }),
	lastUpdated: text().default(sql`(CURRENT_TIMESTAMP)`),
});
