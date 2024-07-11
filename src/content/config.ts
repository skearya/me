import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date(),
		tags: z.array(z.string()),
		image: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
