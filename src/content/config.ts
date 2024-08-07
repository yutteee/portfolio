import { defineCollection, z } from "astro:content";
const postsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        pubDate: z.string(),
        image: z.object({
                url: z.string(),
                alt: z.string(),
        }).optional(),
        description: z.string(),
    }),
});

export const collections = {
  posts: postsCollection,
};
