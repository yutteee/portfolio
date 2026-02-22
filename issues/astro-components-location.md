# Astro コンポーネントをページ単位で整理する

## 現状の問題

`src/components/` に置かれている Astro コンポーネントは実質すべてページ固有であるにもかかわらず、
汎用コンポーネント置き場のような名前のディレクトリに混在している。

```
src/components/
├── BlogPost/         ← pages/posts/[slug].astro 専用
│   ├── index.astro
│   ├── TableOfContents.astro
│   └── TiltImage.astro
├── Top/              ← pages/index.astro 専用
│   ├── TopAnimation.astro
│   ├── TopAboutMe.astro
│   ├── TopArticles.astro
│   └── TopProducts.astro
└── SlidePost.astro   ← pages/posts/[slug].astro 専用（スライド形式）
```

### 何が問題か

- コンポーネントを見てもどのページで使われているか一見わからない
- `src/ui/`（汎用 React コンポーネント）と `src/components/`（ページ固有 Astro コンポーネント）の
  意味的な違いが名前から伝わらない
- ページが増えたとき、`components/` がページ別サブディレクトリの寄せ集めになる

## 理想の状態

ページ固有の Astro コンポーネントは、そのページの近くに置く。

### 案: Astro の `_` プレフィックスを使ってページそばに同居

Astro は `pages/` 配下の `_` 始まりのディレクトリをルートとして扱わない。

```
src/pages/
├── index.astro
├── _components/           ← index.astro が使う Astro コンポーネント
│   ├── TopAnimation.astro
│   ├── TopAboutMe.astro
│   ├── TopArticles.astro
│   └── TopProducts.astro
├── posts/
│   ├── [slug].astro
│   └── _components/       ← [slug].astro が使う Astro コンポーネント
│       ├── BlogPost/
│       │   ├── index.astro
│       │   ├── TableOfContents.astro
│       │   └── TiltImage.astro
│       └── SlidePost.astro
└── ...
```

### 比較

| | 現状 | 案（_ プレフィックス） |
|---|---|---|
| どこで使われるか | ディレクトリ名から推測 | ページそばにあるので明らか |
| ページ追加時 | `components/` に増殖 | ページディレクトリ内に閉じる |
| 汎用コンポーネントとの区別 | 曖昧 | `pages/` 外の `ui/`・`features/` と明確に分かれる |

## 移行スコープ

- `src/components/Top/*` → `src/pages/_components/`
- `src/components/BlogPost/*` → `src/pages/posts/_components/BlogPost/`
- `src/components/SlidePost.astro` → `src/pages/posts/_components/SlidePost.astro`
- 移行後 `src/components/` ディレクトリは削除

各ページの import パスを更新するだけで動作は変わらない。
Storybook や Vitest のスコープ外（`.astro` ファイルはテスト対象外）なので影響は限定的。
