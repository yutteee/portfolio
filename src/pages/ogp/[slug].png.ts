// @ts-nocheck
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { createOgImage } from "../../utils/CreateOgImage";

export async function getStaticPaths() {
  const posts = await getCollection("posts" as never);

  return posts.map((post) => ({
    params: { slug: post.id.replace(/\/index$/, "") },
    props: { post },
  }));
}

export async function GET({ props }: APIContext) {
  const { post } = props as { post: { data: { title: string } } };

  const ogImage = await createOgImage(post?.data.title);

  return new Response(ogImage, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
