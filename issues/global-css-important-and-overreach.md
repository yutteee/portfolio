# global.css に !important とグローバル過ぎるスタイルが含まれている

## 現状の問題

`src/styles/global.css` に2つの問題がある。

### 問題1: `!important` の使用

```css
/* src/styles/global.css */
.expanded {
  display: unset !important;
}
```

`!important` はスタイルの優先度管理の破綻を示すサイン。どこで何のために使われているか、このファイルからは分からない。

### 問題2: `p` タグへのグローバルな `max-width` 適用

```css
html {
  p {
    max-width: 40rem;
  }
}
```

全ての `<p>` タグに `max-width: 40rem` が適用される。レイアウトコンポーネント内の `<p>` が意図せず幅制限を受ける。

### 何が問題か

- `!important` は後から追加された `!important` でしか上書きできないため、スタイルの優先度管理が崩壊していく
- グローバルな `p { max-width }` は、コンポーネントのスタイルを上書きしたり予期しない見た目を生む可能性がある
- `.expanded` クラスの用途がコメントなしで不明

## 理想の状態

### `!important` の排除

`.expanded` が何のためのクラスか調査し、`!important` なしで実現できるよう CSS の詳細度を整理する。または不要なら削除する。

### `p` の `max-width` はグローバルではなくコンポーネントスコープで管理

```css
/* global.css からは削除 */

/* 記事コンテンツなど、実際に必要な箇所でスコープを限定して適用 */
.article-content p {
  max-width: 40rem;
}
```

## 移行スコープ

- `.expanded` クラスの使用箇所を調査し、`!important` を排除する方法を検討
- `p { max-width: 40rem }` をグローバルから削除し、必要なコンポーネントのスコープに移動
