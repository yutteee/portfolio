# テーマ切替の CSS セレクターを `:has()` に変更できるか

## 現状の実装

テーマの切り替えは 3 箇所で連動している。

### 1. `BaseLayout.astro` のブロッキングスクリプト（FOUC 防止）

```js
(function() {
  const theme = localStorage.getItem("theme");
  const isOsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (theme === "dark" || (theme === null && isOsDark)) {
    document.documentElement.classList.add("dark");
  }
})();
```

### 2. `global.css` の CSS セレクター

```css
:root { /* ライトモード変数 */ }
:root.dark { /* ダークモード変数 */ }
```

### 3. `useThemeMode.ts` の classList 操作

```ts
if (isDark) {
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
} else {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("theme", "light");
}
```

## `:has()` を使うとどう変わるか

### アプローチ：hidden input + `html:has(#theme-state:checked)`

`<body>` の先頭に hidden な checkbox を置く。

```html
<!-- BaseLayout.astro <body> の先頭 -->
<input type="checkbox" id="theme-state" hidden>
<script is:inline>
  (function() {
    const theme = localStorage.getItem("theme");
    const isOsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (theme === null && isOsDark)) {
      document.getElementById("theme-state").checked = true;
    }
  })();
</script>
```

CSS セレクターを変更。

```css
:root { /* ライトモード変数 */ }
html:has(#theme-state:checked) { /* ダークモード変数 */ }
```

`useThemeMode.ts` から `classList` 操作を除去し、代わりに checkbox を制御する。

```ts
const input = document.getElementById("theme-state") as HTMLInputElement;
if (isDark) {
  input.checked = true;
  localStorage.setItem("theme", "dark");
} else {
  input.checked = false;
  localStorage.setItem("theme", "light");
}
```

## メリット

- テーマの状態が `<html>` クラスという副作用なしで、専用の DOM 要素に集約される
- CSS が「状態を持つ要素」を直接参照するためより宣言的
- `document.documentElement.classList.add/remove` という命令的操作をなくせる

## デメリット・注意点

- hidden input が DOM に追加される（`hidden` 属性があるのでアクセシビリティ上の問題はないが要素が増える）
- React state（`isDark`）と hidden input の `checked` が 2 箇所での状態管理になる
- inline script の対象が `document.documentElement` から `getElementById` に変わるため、input 要素が inline script より前に HTML 上で存在している必要がある
- ブラウザサポート: Chrome 105+, Firefox 121+, Safari 15.4+（Safari 15.3 以前は非対応）

## 結論

現状の `.dark` クラス方式で実装上の問題は生じていないため、急ぎの移行ではない。ただし以下の目的がある場合は検討に値する。

- CSS をより宣言的にしたい
- `document.documentElement` への直接操作を減らしたい

## 移行スコープ（もし実施する場合）

- `BaseLayout.astro`: `<body>` 先頭に `<input id="theme-state" type="checkbox" hidden>` を追加し、inline script の制御対象を変更
- `global.css`: `:root.dark` → `html:has(#theme-state:checked)` に変更
- `useThemeMode.ts`: `classList.add/remove` → `getElementById("theme-state").checked` に変更
