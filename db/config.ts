import { defineDb, defineTable, column, NOW } from "astro:db";

const tracks = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		title: column.text(),
		artist: column.text(),
		coverUrl: column.text(),
		audioPreview: column.text({ optional: true }),
		color: column.text(),
	},
});

const playlists = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		name: column.text(),
		thumbnailUrl: column.text(),
		color: column.text(),
		lastUpdated: column.date({ default: NOW }),
	},
});

const playlistItems = defineTable({
	columns: {
		playlistId: column.text({ references: () => playlists.columns.id }),
		title: column.text(),
		artist: column.text(),
		audioPreview: column.text({ optional: true }),
	},
});

export default defineDb({
	tables: {
		tracks,
		playlists,
		playlistItems,
	},
});
