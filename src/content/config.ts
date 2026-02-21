import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    description: z.string(),
    marp: z.boolean().default(false),
    theme: z.enum(["default", "custom-theme"]).default("default"),
  }),
});

export const collections = {
  posts: postsCollection,
};
