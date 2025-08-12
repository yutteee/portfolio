---
title: 'astroブログでmarp対応した'
pubDate: "2025-08-12"
description: 'astroで作成したブログサイトでmarpで作成したスライドを公開できる仕組みを作りました。'
type: 'slide'
theme: 'custom-theme'
---

<!-- _class: title -->

# astroブログでmarp対応した

LT会 2025/08/12

---

<!--  _class: strong -->

<div class="flex-container">

![オカメインコの写真。机の上に載ってこちらを見上げている。 w:300 h:300](./icon.png)

<div>

## ゆってぃー

- UI/UX, アクセシビリティ
- お笑いと読書とお酒が好き

</div>
</div>

---

## やったこと

[私のポートフォリオ](https://yutteee.pages.dev/)に、marpでスライドを作成して公開できる仕組みを作りました。

---

## 目次

- 開発背景
- 機能と実装
- スライドデザイン

---

<!--  _class: strong -->

## 開発背景

---

## なぜ作成した？

### 自分だけのスライドテンプレートが欲しかった

- 自分の好みの形式のスライドを作りやすくしたい
- 個人的なブランディングをしたい（**他の人と被りたくない**）
- スライドの装飾ではなく、内容に集中できる環境を作りたい

---

## marpとは？

### Markdownでスライドを作成できるツール

- Markdown記法でスライドを書ける
- HTML/CSSやPDFに変換可能
- 見た目はCSSでカスタマイズ可能

---

## marpの良さ

### 構造化されたテキストでスライドを作成することができる

- スライドの一貫性とアクセシビリティを担保しやすい
- AIエージェントを使ってスライドを作れる

---

<!--  _class: strong -->

## 実装

---

## 使用技術1

### Astro
- 静的コンテンツ配信に特化したフロントエンドフレームワーク
- MarkdownをHTMLに変換して公開することもできる
- 本ポートフォリオでの作成に使用

---

## Astroでのmarkdownの公開

### Astroのコンテンツ管理システムのContent Collectionsを使用

Markdownをコンテンツ管理できる

- `src/content/posts/` にMarkdownファイルを配置
- `getCollection()` で`/src/content/posts`にあるファイル一覧の内容を取得
- ページとしてサイト公開
---

## 使用技術2

### marp-team/marp-core
Node.js環境でMarp形式のMarkdownをHTML/CSSに変換

```typescript
const marp = new Marp();
const result = marp.render(post.body);
```

```jsx
<div class="slide-container" set:html={result.html} />
<style set:html={result.css} />
```

---

<!--  _class: strong -->

## スライドデザイン

---

## 意識したこと

### 各スライドの主張を明確にする

- 結論を一番強く装飾して先に書いた
- 情報をあまり詰めれないようにした

---

<!--  _class: strong -->

## まとめ

- スライドが楽に作れるようになった！