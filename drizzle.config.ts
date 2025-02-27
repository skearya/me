import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

export default defineConfig({
	schema: "./src/schema.ts",
	out: "./migrations",
	dialect: "turso",
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL ?? "",
		authToken: process.env.TURSO_AUTH_TOKEN ?? "",
	},
});
