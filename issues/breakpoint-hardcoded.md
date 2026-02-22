# ブレークポイントが複数ファイルにハードコードされている

## 現状の問題

`@media screen and (max-width: 1000px)` が複数のコンポーネントファイルに散在している。

```css
/* src/pages/index.astro */
@media screen and (max-width: 1000px) { ... }

/* src/components/Top/TopAboutMe.astro */
@media screen and (max-width: 1000px) { ... }

/* src/components/Top/TopArticles.astro */
@media screen and (max-width: 1000px) { ... }

/* src/components/BlogPost/index.astro */
@media screen and (min-width: 1001px) { ... }
```

### 何が問題か

- ブレークポイントの値を変更する場合、すべてのファイルを検索して修正しなければならない
- `max-width: 1000px` と `min-width: 1001px` のように1px のずれで管理されており、一貫性が不明確

## 理想の状態

ブレークポイントを CSS カスタムプロパティまたは SCSS 変数で一元管理する。

### 案: CSS カスタムプロパティとカスタムメディアクエリ（PostCSS）

```css
/* src/styles/global.css */
@custom-media --sp (max-width: 1000px);
@custom-media --pc (min-width: 1001px);
```

```css
/* 各コンポーネント */
@media (--sp) {
  .title { font-size: 2rem; }
}
```

### 案: CSS 変数として値だけ管理（現実的な移行案）

```css
:root {
  --breakpoint-sp: 1000px;
}
```

コメントとして統一値を明示し、grep で一元管理の基点にする。

## 移行スコープ

- ブレークポイント値の一元管理方針を決定（カスタムメディア or CSS変数）
- `src/styles/global.css` に定義を追加
- 各コンポーネントのメディアクエリを更新
