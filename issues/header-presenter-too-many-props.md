# HeaderPresenter の props が多すぎる

## 現状の問題

Container/Presenter パターンを採用しているが、`HeaderPresenter` に渡す props が11個ある。

```ts
// src/features/Header/presenter.tsx
export type HeaderPresenterProps = {
  menuOpen: boolean;       // メニュー開閉状態
  onOpen: () => void;      // メニューを開く
  onClose: () => void;     // メニューを閉じる
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  isDark: boolean;         // テーマ状態
  onThemeToggle: () => void;
  darkBtnRef: React.RefObject<HTMLButtonElement>;
  lightBtnRef: React.RefObject<HTMLButtonElement>;
  currentPage?: CurrentPage;
  spMenuRef: React.RefObject<HTMLDivElement>;
  hamburgerRef: React.RefObject<HTMLButtonElement>;
};
```

### 何が問題か

- props が多いと Presenter の「表示に専念する」という役割が曖昧になる
- ref を Props で大量に受け渡すことで、Presenter がフォーカス管理の詳細を知る必要が生まれている
- テストやStorybookでのモックコストが高い

## 理想の状態

関連する props をオブジェクトにまとめて受け渡し、props 数を削減する。
（なお、テーマトグルを1ボタン化すれば `darkBtnRef`・`lightBtnRef` が消え、自然に削減される）

```ts
type MenuProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  hamburgerRef: React.RefObject<HTMLButtonElement>;
  spMenuRef: React.RefObject<HTMLDivElement>;
};

type ThemeProps = {
  isDark: boolean;
  onToggle: () => void;
  ref: React.RefObject<HTMLButtonElement>;
};

export type HeaderPresenterProps = {
  menu: MenuProps;
  theme: ThemeProps;
  currentPage?: CurrentPage;
};
```

## 移行スコープ

- `HeaderPresenterProps` の型を整理
- `Header/index.tsx`（Container）の呼び出し箇所を更新
- テーマトグル1ボタン化（`theme-toggle-two-buttons`）と合わせて対応すると効果的
