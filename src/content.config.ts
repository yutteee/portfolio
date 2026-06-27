import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
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

const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    period: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    url: z.string().optional(),
    github: z.string().optional(),
    tech: z.array(z.string()).optional(),
  }),
});

// スクラップ: ブログより粒度の細かい学びのメモ。
const scrapsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/scraps" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  posts: postsCollection,
  products: productsCollection,
  scraps: scrapsCollection,
};
