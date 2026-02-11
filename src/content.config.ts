import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date(),
		tags: z.array(z.string()),
		image: z.string().optional(),
		video: z.string().optional(),
	}),
});

const projectCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/projects" }),
});

export const collections = {
	blog: blogCollection,
	projects: projectCollection,
};
