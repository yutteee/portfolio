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

![中村優作のプロフィール画像 w:300 h:300](./icon.png)

<div>

## 中村優作

- 都内でエンジニアをしています
- UI/UX, アクセシビリティ
- お笑いと読書とお酒が好き

</div>
</div>

---

## 目次

- 実装した機能
- 技術的な詳細
- カスタムテーマ
- 今後の展望

---

## 実装した機能

### スライド記事の公開
- 通常のブログ記事とスライド記事を区別
- `type: 'slide'` でスライドとして認識
- MarpでMarkdownをスライドに変換

### カスタムテーマ対応
- 独自のCSSテーマを作成
- ポートフォリオサイトのデザインに統一
- `theme: 'custom-theme'` で適用

---

## 技術的な詳細

### 使用ライブラリ
```bash
@marp-team/marp-core: ^4.1.0
```

### 実装ポイント
- `[slug].astro` でスライド判定
- `SlidePost.astro` コンポーネントで表示
- カスタムテーマの動的適用

---

## ファイル構成

```
src/
├── pages/posts/[slug].astro    # スライド判定・レンダリング
├── components/SlidePost.astro  # スライド表示コンポーネント
├── marp-themes/
│   ├── custom-theme.css        # カスタムテーマ
│   └── index.ts               # テーマ管理
└── content/config.ts          # スキーマ定義
```

---

## カスタムテーマ

### デザイン方針
- ポートフォリオサイトの色合いに統一
- 読みやすいフォントサイズとレイアウト
- レスポンシブ対応

### CSS変数の活用
```css
section {
  background-color: var(--color-white);
  color: var(--color-text);
  font-size: 1.5rem;
  padding: 3rem;
}
```

---

## 実装の流れ

1. **スライド判定**
   ```typescript
   const isSlide = post.data.type === "slide";
   ```

2. **Marpレンダリング**
   ```typescript
   const marp = new Marp();
   const result = marp.render(post.body);
   ```

3. **テーマ適用**
   ```typescript
   if (theme === "custom-theme") {
     slideCss = marpThemes["custom-theme"];
   }
   ```

---

## 今後の展望

### 追加予定機能
- スライドナビゲーション
- フルスクリーンモード
- プレゼンテーションモード
- スライドエクスポート機能

### テーマ拡張
- ダークモード対応
- アニメーション効果
- より多くのカスタマイズオプション

---

## まとめ

### 実現できたこと
- Markdownでスライド作成
- カスタムテーマ適用
- 既存ブログとの統合
- レスポンシブ対応

### 技術的な学び
- Marpの活用方法
- Astroでの動的コンテンツ生成
- CSS変数を使ったテーマ管理

---

## 参考リンク

- [Marp公式サイト](https://marp.app/)
- [Astro公式ドキュメント](https://docs.astro.build/)
- [GitHubリポジトリ](https://github.com/yutteee/portfolio)

---

# ありがとうございました！

### 質問・フィードバック歓迎です

