import { getCollection, type CollectionEntry } from "astro:content";

/**
 * スクラップを公開日の新しい順に並べて返す。
 * 本文のレンダリングは呼び出し側で `render(scrap)` を使う（posts/[slug] と同じ作法）。
 */
export const getAllScraps = async (): Promise<CollectionEntry<"scraps">[]> => {
  const scraps = await getCollection("scraps");
  return scraps.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
};
