CREATE TABLE `cache` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text,
	`lastUpdated` text DEFAULT (CURRENT_TIMESTAMP)
);
