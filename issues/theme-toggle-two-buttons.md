# テーマ切り替えに2つのボタンを使っている

## 現状の問題

ダーク/ライトモードの切り替えを「ダークモードにするボタン」と「ライトモードにするボタン」の2つで実装し、`display: none / inline-flex` で切り替えている。

```tsx
// src/features/Header/presenter.tsx
<div style={{ display: isDark ? "none" : "inline-flex" }}>
  <IconButton label="ダークモードにする" icon="FiMoon" ref={darkBtnRef} ... />
</div>
<div style={{ display: isDark ? "inline-flex" : "none" }}>
  <IconButton label="ライトモードにする" icon="FiSun" ref={lightBtnRef} ... />
</div>
```

### 何が問題か

- 2本の ref（`darkBtnRef`・`lightBtnRef`）が必要になり、`useThemeMode` がフォーカス管理まで担うことになっている
- `Header` コンポーネントが受け取る props が増える原因になっている（11個のうち2個がこれ）
- DOM に常に2つのボタンが存在するため、スクリーンリーダーが `display: none` 側のボタンを読む可能性がある

## 理想の状態

1つのトグルボタンに `aria-pressed` と動的な `aria-label` を使い、ref は1本で済む実装にする。

```tsx
<button
  type="button"
  aria-label={isDark ? "ライトモードにする" : "ダークモードにする"}
  aria-pressed={isDark}
  onClick={onThemeToggle}
  ref={themeToggleBtnRef}
>
  {isDark ? <FiSun size={36} /> : <FiMoon size={36} />}
</button>
```

## 移行スコープ

- `presenter.tsx` の2ボタン構成を1ボタンに変更
- `useThemeMode` から `darkBtnRef`・`lightBtnRef` の受け取りを削除
- `Header/index.tsx` の `darkBtnRef`・`lightBtnRef` の useRef を削除
- `HeaderPresenter` の props 型を整理
