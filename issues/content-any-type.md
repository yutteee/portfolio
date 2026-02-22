# BlogPost コンポーネントで Content が any 型になっている

## 現状の問題

`src/components/BlogPost/index.astro` で、Astro の `render()` が返す `Content` を `any` 型で受け取っている。

```ts
// src/components/BlogPost/index.astro
interface Props {
  post: CollectionEntry<"posts">;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Content: any;  // ← any
  headings: { depth: number; slug: string; text: string }[];
}
```

biome の警告を `biome-ignore` で黙らせており、型安全が失われている。

### 何が問題か

- `Content` が `any` のため、誤った props を渡してもコンパイルエラーにならない
- コメントの `<explanation>` が空で、なぜ `any` が必要なのかの理由が記述されていない

## 理想の状態

Astro が提供する型を使い、`any` を排除する。

```ts
import type { MarkdownInstance } from "astro";

interface Props {
  post: CollectionEntry<"posts">;
  Content: MarkdownInstance<Record<string, unknown>>["Content"];
  headings: { depth: number; slug: string; text: string }[];
}
```

または、`AstroComponentFactory` 型を使う方法も有効。

```ts
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

interface Props {
  Content: AstroComponentFactory;
  ...
}
```

## 移行スコープ

- `BlogPost/index.astro` の `Content: any` を適切な Astro 型に置き換え
- `biome-ignore` コメントを削除
