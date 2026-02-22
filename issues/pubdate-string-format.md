# pubDate が文字列のまま表示されている

## 現状の問題

記事の公開日（`pubDate`）が `string` 型のまま UI に表示されている。

```tsx
// src/ui/BlogPost/index.tsx
<div>{date}</div>   // "2024-01-15" がそのまま表示される

// src/components/BlogPost/index.astro
<span>{post.data.pubDate}</span>   // 同様
```

`Post` インターフェースでも `pubDate` は `string` 型として定義されている。

```ts
// src/content/post.ts
export interface Post {
  pubDate: string;  // ← string
  ...
}
```

### 何が問題か

- `"2024-01-15"` のような ISO 形式の文字列がそのまま表示され、日本語表記（例: `2024年1月15日`）になっていない
- 表示フォーマットの変更を行う際に、変更箇所を探しにくい
- `string` より `Date` 型の方が日付操作（ソートなど）が安全

## 理想の状態

`pubDate` を `Date` 型にし、表示時にフォーマット関数を通す。

```ts
// src/content/post.ts
export interface Post {
  pubDate: Date;
  ...
}

// フォーマットユーティリティ
export const formatDate = (date: Date): string =>
  date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
// → "2024年1月15日"
```

```tsx
// src/ui/BlogPost/index.tsx
<div>{formatDate(new Date(date))}</div>
```

## 移行スコープ

- `Post` インターフェースの `pubDate` を `Date` 型に変更（または変換処理を追加）
- `formatDate` ユーティリティ関数を作成
- `src/ui/BlogPost/index.tsx` と `src/components/BlogPost/index.astro` で `formatDate` を使うよう変更
- Content Collections のスキーマ (`src/content/config.ts`) の `pubDate` 型も確認・更新
