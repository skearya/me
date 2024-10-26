import { defineDb, defineTable, column, NOW } from "astro:db";

const cache = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		data: column.json(),
		lastUpdated: column.date({ default: NOW }),
	},
});

export default defineDb({
	tables: {
		cache,
	},
});
