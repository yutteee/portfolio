/**
 * スライド（Marp）記事の画像にまつわる処理を集約するモジュール。
 *
 * 通常のブログ記事は Astro のコンテンツコレクション（`render()`）を通すため
 * 相対パスの画像が自動で解決される。一方スライド記事は Marp で本文を直接
 * レンダリングしており画像が解決されないため、ビルド時に画像を `public/` 配下へ
 * コピーし（`scripts/copy-images.js`）、本文中の画像パスをその public パスへ
 * 書き換える（`SlidePost.astro`）必要がある。
 *
 * コピー先ディレクトリとパス書き換えはペアで一致している必要があるため、
 * 両者がこのモジュールを参照することで定義を一元化する。
 */

/** スライド記事の画像を配置する public 配下のディレクトリ名 */
export const SLIDE_IMAGE_PUBLIC_DIR = "posts";

/**
 * 記事 ID（`<slug>/index`）から slug を取り出す。
 * public へのコピー先ディレクトリ名・画像パスの両方で同じ slug を使う。
 */
export function toPostSlug({ id }: { id: string }): string {
  return id.replace(/\/index$/, "");
}

/**
 * スライド本文中の相対画像パスを public 配下の絶対パスへ書き換える。
 * 例: `![画像の説明](image.png)` -> `![画像の説明](/posts/20250812/image.png)`
 */
export function resolveSlideImagePaths({
  body,
  slug,
}: {
  body: string;
  slug: string;
}): string {
  return body.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    `![$1](/${SLIDE_IMAGE_PUBLIC_DIR}/${slug}/$2)`,
  );
}
