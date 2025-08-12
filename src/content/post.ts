import { getCollection, type CollectionEntry } from "astro:content";
import { JSDOM } from "jsdom";
import { externalBlogs } from "../data/externalBlog";

export interface Post {
  url: string;
  title: string;
  pubDate: string;
  image: string;
  alt: string;
  isExternal: boolean;
  marp: boolean;
  theme: 'default' | 'custom-theme';
}

const getOgpImageFromUrl = async (url: string) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const ogpImage = dom.window.document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content");

    return ogpImage;
  } catch (e) {
    console.error(e);
    return "";
  }
};

const processLocalPosts = (posts: CollectionEntry<"posts">[]): Post[] => {
  return posts.map((post) => {
    const slug = post.slug.replace(/\/index$/, "");
    return {
    url: `/posts/${slug}`,
    title: post.data.title,
    pubDate: post.data.pubDate,
    image: post.data.image
      ? post.data.image.url
      : `${import.meta.env.PUBLIC_SITE_URL}/ogp/${slug}.png`,
    alt: post.data.image
      ? post.data.image.alt
      : `サムネイル画像。白いPCのイラストに、「${post.data.title}」の文字が重なっている。`,
    isExternal: false,
    marp: post.data.marp,
    theme: post.data.theme,
  }});
};

const getExternalPosts = async (): Promise<Post[]> => {
  const externalPosts = await Promise.all(
    externalBlogs.map(async (blog) => ({
      url: blog.url,
      title: blog.title,
      pubDate: blog.pubDate,
      image: (await getOgpImageFromUrl(blog.url)) || "",
      alt: `サムネイル画像。${blog.title}`,
      isExternal: true,
    }))
  );

  return externalPosts.filter((post): post is Post => post.image !== "");
};

const sortPostsByDate = (posts: Post[]): Post[] => {
  return posts.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB.getTime() - dateA.getTime();
  });
};

export const getAllPosts = async (): Promise<Post[]> => {
  const localPostsCollection = await getCollection("posts");
  const localPosts = processLocalPosts(localPostsCollection);
  const externalPosts = await getExternalPosts();

  const allPosts = [...localPosts, ...externalPosts];

  return sortPostsByDate(allPosts);
}; 