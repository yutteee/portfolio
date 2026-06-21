---
category: ui
---

汎用ボタンです。`href` を渡すと `a` 要素、渡さなければ `button` 要素として描画されます（discriminated union）。`startIcon` / `endIcon` に `react-icons` のアイコンコンポーネントを渡すと、ラベルの先頭・末尾にアイコンを表示します。ピル型・`--color-surface` 背景・`--color-border` のボーダーを持ち、hover/focus で `--color-accent` に変化します。`onClick` や `aria-label`・`target` などの標準 HTML 属性はそのまま透過されます。一覧リンクなど「テキスト＋右矢印」のリンクボタンは、`href` と `endIcon={FiArrowRight}` を渡して構成します。
