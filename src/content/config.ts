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
        type: z.enum(['blog', 'slide']).default('blog'),
        theme: z.string().optional(),
    }),
});

export const collections = {
  posts: postsCollection,
};
