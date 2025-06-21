import { JSDOM } from "jsdom";
import { externalBlogs } from "../data/externalBlog";

export interface Post {
  url: string;
  title: string;
  pubDate: string;
  image: string;
  alt: string;
  isExternal: boolean;
}

const getFileName = (file: string) => {
  const fileNameWithExtentision = file.split("/").pop();
  const fileName = fileNameWithExtentision?.replace(".md", "");

  return fileName;
};

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

export interface Frontmatter {
  title: string;
  pubDate: string;
  image?: {
    url: string;
    alt: string;
  };
}

const processLocalPosts = (
  posts: MarkdownInstance<Frontmatter>[]
): Post[] => {
  return posts.map((post) => ({
    url: `/posts/${getFileName(post.file)}`,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
    image: post.frontmatter.image
      ? post.frontmatter.image.url
      : `${import.meta.env.PUBLIC_SITE_URL}/ogp/${getFileName(post.file)}.png`,
    alt: post.frontmatter.image
      ? post.frontmatter.image.alt
      : `サムネイル画像。白いPCのイラストに、「${post.frontmatter.title}」の文字が重なっている。`,
    isExternal: false,
  }));
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

type MarkdownInstance<T> = {
  file: string;
  frontmatter: T;
  rawContent: () => string;
  compiledContent: () => string;
  Content: unknown;
  getHeadings: () => unknown[];
};

export const getAllPosts = async (
  localPostsGlob: MarkdownInstance<Frontmatter>[]
): Promise<Post[]> => {
  const localPosts = processLocalPosts(localPostsGlob);
  const externalPosts = await getExternalPosts();

  const allPosts = [...localPosts, ...externalPosts];

  return sortPostsByDate(allPosts);
}; 