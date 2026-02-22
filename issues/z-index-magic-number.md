# z-index に極端なマジックナンバーが使われている

## 現状の問題

`src/pages/index.astro` で `z-index: 1000000` という極端な値が使われている。

```css
/* src/pages/index.astro:39 */
.background {
  z-index: 1000000;
  ...
}
```

### 何が問題か

- `z-index: 1000000` は z-index の重なり順が管理されておらず、競合を力で解決した典型的なパターン
- 他の要素で同様の問題が起きた場合、`z-index: 10000000` のようにさらに大きな値が使われるリスクがある
- z-index の意図（何の上に重ねたいか）がコードから読み取れない

## 理想の状態

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

## 移行スコープ

- `src/styles/global.css` に z-index カスタムプロパティを定義
- `src/pages/index.astro` の `z-index: 1000000` を変数に置き換え
- プロジェクト全体の z-index 使用箇所を確認して整理
