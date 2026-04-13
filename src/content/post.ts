import { getCollection, type CollectionEntry } from "astro:content";
import { externalBlogs } from "../data/externalBlog";
import { SITE_URL } from "../consts";

export interface Post {
  url: string;
  title: string;
  pubDate: string;
  image: string;
  alt: string;
  isExternal: boolean;
  marp: boolean;
  theme: "default" | "custom-theme";
}

const processLocalPosts = (posts: CollectionEntry<"posts">[]): Post[] => {
  return posts.map((post) => {
    const slug = post.slug.replace(/\/index$/, "");
    return {
      url: `/posts/${slug}`,
      title: post.data.title,
      pubDate: post.data.pubDate,
      image: post.data.image
        ? post.data.image.url
        : `${SITE_URL}/ogp/${slug}.png`,
      alt: post.data.image
        ? post.data.image.alt
        : `サムネイル画像。白いPCのイラストに、「${post.data.title}」の文字が重なっている。`,
      isExternal: false,
      marp: post.data.marp,
      theme: post.data.theme,
    };
  });
};

const getExternalPosts = (): Post[] => {
  return externalBlogs.map((blog) => ({
    url: blog.url,
    title: blog.title,
    pubDate: blog.pubDate,
    image: blog.image || `${SITE_URL}/ogp.png`,
    alt: `サムネイル画像。${blog.title}`,
    isExternal: true,
    marp: false,
    theme: "default" as const,
  }));
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
  const externalPosts = getExternalPosts();

  const allPosts = [...localPosts, ...externalPosts];

  return sortPostsByDate(allPosts);
};
