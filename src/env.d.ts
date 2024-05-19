/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<{ MAL_CLIENT_ID: string }>;

declare namespace App {
	interface Locals extends Runtime {}
}
