# 記事ページが BaseLayout を使っていない

## 現状の問題

`src/layouts/BaseLayout.astro` が存在するにもかかわらず、記事ページ（`src/pages/posts/[slug].astro`）はレイアウトを使わず独自に `<html>`・`<head>`・`Header`・`Footer` をフルで記述している。

```
src/layouts/BaseLayout.astro   ← Header, Footer, SEO をまとめたレイアウト
src/pages/index.astro          ← BaseLayout を使用 ✓
src/pages/about/index.astro    ← BaseLayout を使用 ✓
src/pages/posts/[slug].astro   ← 独自に <html> から書いている ✗
```

### 何が問題か

- SEO 設定（`<SEO>` コンポーネント）が `BaseLayout` と `[slug].astro` の2箇所に分散し、二重管理になっている
- 記事ページの OGP `type` が `"article"` に固定されているが、`BaseLayout` 側では全ページ `"article"` になっており、どちらも設定が正しくない
- `BaseLayout` を変更しても記事ページに反映されない（ヘッダー変更の際に更新漏れが起きやすい）

## 理想の状態

`BaseLayout` に `ogpImage?: string` などの props を追加し、記事ページでも共通レイアウトを使う。

```astro
---
// BaseLayout.astro
interface Props {
  title: string;
  description: string;
  ogpImage?: string;
  ogpType?: "website" | "article";
}
---
```

```astro
---
// posts/[slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
---
<BaseLayout
  title={post.data.title}
  description={post.data.description}
  ogpImage={`${import.meta.env.PUBLIC_SITE_URL}/ogp/${post.slug}.png`}
  ogpType="article"
>
  ...
</BaseLayout>
```

## 移行スコープ

- `BaseLayout.astro` に `ogpImage`・`ogpType` props を追加
- `[slug].astro` の独自 `<html>` 記述を削除し `BaseLayout` に差し替え
- 記事ページ固有の SEO 設定（`twitter:card` など）を `BaseLayout` に統合または props 化
