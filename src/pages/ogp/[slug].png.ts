// @ts-nocheck
import type { APIContext } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import { createOgImage } from "../../utils/CreateOgImage";

export async function getStaticPaths() {
	const posts = await getCollection("posts" as never);

	return posts.map((post) => ({
		params: { slug: post.slug },
	}));
}

export async function GET({ params }: APIContext) {
	const post = await getEntryBySlug("posts" as never, params.slug as string);

	const ogImage = await createOgImage(post?.data.title);

	return new Response(ogImage, {
		headers: {
			"Content-Type": "image/png",
		},
	});
}
