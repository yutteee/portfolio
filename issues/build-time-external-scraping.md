# ビルド時に外部サイトをスクレイピングしている

## 現状の問題

`src/content/post.ts` の `getExternalPosts()` が、ビルドのたびに外部ブログの URL へ fetch してOGP画像URLを取得している。

```ts
// src/content/post.ts
const getOgpImageFromUrl = async (url: string) => {
  const res = await fetch(url);              // 外部へHTTPリクエスト
  const html = await res.text();
  const dom = new JSDOM(html);
  const ogpImage = dom.window.document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content");
  return ogpImage;
};
```

### 何が問題か

- **ビルドの安定性**: 外部サービスのダウンや応答遅延でビルドが失敗・大幅に遅延する
- **ネットワーク依存**: CI 環境でネットワーク制限がある場合に動かない
- **冪等性がない**: 外部サイトの OGP 画像が変わるとビルド結果が変わる
- **レート制限リスク**: 同一サイトへの連続リクエストでブロックされる可能性がある

## 理想の状態

外部記事の OGP 画像は静的に管理し、ビルド時のネットワークアクセスをなくす。

### 案: `externalBlog.ts` に画像URLを直接記載

```ts
// src/data/externalBlog.ts
export const externalBlogs = [
  {
    url: "https://example.com/article",
    title: "記事タイトル",
    pubDate: "2024-01-01",
    image: "https://example.com/ogp.png",  // ← 静的に保持
  },
  // ...
];
```

これにより `getOgpImageFromUrl` と `jsdom` 依存を削除でき、ビルドが安定・高速になる。

## 移行スコープ

- `src/data/externalBlog.ts` に `image` フィールドを追加
- `src/content/post.ts` の `getOgpImageFromUrl` 関数を削除
- `getExternalPosts` を同期関数（または単純なmap）に変更
- `jsdom` の依存をpackage.jsonから削除できるか確認
