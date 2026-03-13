# CSS・デザインシステム未整備の課題まとめ

デザインシステムが整っていないことに起因する CSS 関連の課題をまとめたファイルです。

---

## 1. ブレークポイントが複数ファイルにハードコードされている

元 issue: `breakpoint-hardcoded.md`

### 現状の問題

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

- ブレークポイントの値を変更する場合、すべてのファイルを検索して修正しなければならない
- `max-width: 1000px` と `min-width: 1001px` のように 1px のずれで管理されており、一貫性が不明確

### 理想の状態

ブレークポイントを一元管理する。

**案1: CSS カスタムメディアクエリ（PostCSS）**

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

**案2: CSS 変数として値だけ管理（現実的な移行案）**

```css
:root {
  --breakpoint-sp: 1000px;
}
```

### 移行スコープ

- ブレークポイント値の一元管理方針を決定（カスタムメディア or CSS変数）
- `src/styles/global.css` に定義を追加
- 各コンポーネントのメディアクエリを更新

---

## 2. z-index にマジックナンバーが使われている

元 issue: `z-index-magic-number.md`

### 現状の問題

`src/pages/index.astro` で `z-index: 1000000` という極端な値が使われている。

```css
/* src/pages/index.astro:39 */
.background {
  z-index: 1000000;
  ...
}
```

- z-index の重なり順が管理されておらず、競合を力で解決した典型的なパターン
- 他の要素で同様の問題が起きた場合、`z-index: 10000000` のようにさらに大きな値が使われるリスクがある
- z-index の意図（何の上に重ねたいか）がコードから読み取れない

### 理想の状態

z-index を CSS カスタムプロパティで体系的に管理する。

```css
/* src/styles/global.css */
:root {
  --z-index-background: 0;
  --z-index-content: 10;
  --z-index-header: 100;
  --z-index-modal: 200;
  --z-index-toast: 300;
}
```

```css
/* src/pages/index.astro */
.background {
  z-index: var(--z-index-content);
}
```

値を小さな整数に保つことで、重なり順の意図が明確になり管理しやすくなる。

### 移行スコープ

- `src/styles/global.css` に z-index カスタムプロパティを定義
- `src/pages/index.astro` の `z-index: 1000000` を変数に置き換え
- プロジェクト全体の z-index 使用箇所を確認して整理

---

## 3. global.css に `!important` とグローバル過ぎるスタイルが含まれている

元 issue: `global-css-important-and-overreach.md`

### 現状の問題

`src/styles/global.css` に2つの問題がある。

**問題1: `!important` の使用**

```css
/* src/styles/global.css */
.expanded {
  display: unset !important;
}
```

`!important` はスタイルの優先度管理の破綻を示すサイン。どこで何のために使われているか、このファイルからは分からない。

**問題2: `p` タグへのグローバルな `max-width` 適用**

```css
html {
  p {
    max-width: 40rem;
  }
}
```

全ての `<p>` タグに `max-width: 40rem` が適用される。レイアウトコンポーネント内の `<p>` が意図せず幅制限を受ける。

- `!important` は後から追加された `!important` でしか上書きできないため、スタイルの優先度管理が崩壊していく
- グローバルな `p { max-width }` は、コンポーネントのスタイルを上書きしたり予期しない見た目を生む可能性がある
- `.expanded` クラスの用途がコメントなしで不明

### 理想の状態

**`!important` の排除**

`.expanded` が何のためのクラスか調査し、`!important` なしで実現できるよう CSS の詳細度を整理する。または不要なら削除する。

**`p` の `max-width` はコンポーネントスコープで管理**

```css
/* global.css からは削除 */

/* 記事コンテンツなど、実際に必要な箇所でスコープを限定して適用 */
.article-content p {
  max-width: 40rem;
}
```

### 移行スコープ

- `.expanded` クラスの使用箇所を調査し、`!important` を排除する方法を検討
- `p { max-width: 40rem }` をグローバルから削除し、必要なコンポーネントのスコープに移動

---

## 共通の方向性

3つの課題はいずれも「デザイントークンが存在しない」ことに起因している。

| 課題 | 対応するトークン |
|------|----------------|
| ブレークポイントのハードコード | `--breakpoint-*` |
| z-index のマジックナンバー | `--z-index-*` |
| グローバル CSS の肥大化 | スコープ設計の整備 |

取り組む際は `src/styles/global.css` にデザイントークンをまとめて定義し、各コンポーネントから参照する形に統一するのが望ましい。
