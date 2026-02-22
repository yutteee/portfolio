# BaseLayout の OGP type が全ページで "article" になっている

## 現状の問題

`src/layouts/BaseLayout.astro` の OGP 設定で `type` が全ページ `"article"` にハードコードされている。

```astro
<!-- src/layouts/BaseLayout.astro -->
<SEO
  openGraph={{
    basic: {
      title: `${title} | yutteee-portfolio`,
      type: "article",   ← 全ページで "article"
      image: `${import.meta.env.PUBLIC_SITE_URL}/portfolio.png`,
    },
  }}
/>
```

### 何が問題か

OGP の `type` は SNS シェア時のリッチカード表示に影響する。

| ページ | 正しい type | 現状 |
|---|---|---|
| トップ (`/`) | `"website"` | `"article"` ✗ |
| 私について (`/about/`) | `"website"` | `"article"` ✗ |
| プロダクト (`/products/`) | `"website"` | `"article"` ✗ |
| 記事 (`/posts/[slug]`) | `"article"` | `"article"` ✓（ただし BaseLayout 未使用） |

## 理想の状態

`BaseLayout` に `ogpType` prop を追加し、ページごとに指定できるようにする。

```astro
---
interface Props {
  title: string;
  description: string;
  ogpType?: "website" | "article";  // デフォルトは "website"
}
const { title, description, ogpType = "website" } = Astro.props;
---
<SEO
  openGraph={{
    basic: {
      type: ogpType,
      ...
    },
  }}
/>
```

## 移行スコープ

- `BaseLayout.astro` の Props に `ogpType` を追加（デフォルト `"website"`）
- 記事ページ（`[slug].astro`）を `BaseLayout` に統合する際に `ogpType="article"` を指定
- その他のページはデフォルト（`"website"`）のまま
