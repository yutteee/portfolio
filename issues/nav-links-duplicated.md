# PC ナビとSPナビのリンクが重複管理されている

## 現状の問題

`src/features/Header/presenter.tsx` にPC用ナビゲーションとSP用ナビゲーションが別々にハードコードされており、リンク一覧が2箇所に存在する。

```tsx
// PCナビ (presenter.tsx:41-63)
<nav aria-label="メインナビゲーション">
  <a href="/about/">私について</a>
  <a href="/products/">プロダクト</a>
  <a href="/posts/">記事</a>
</nav>

// SPナビ (presenter.tsx:108-113)
<nav aria-label="スマホメニュー">
  <a href="/">トップページ</a>
  <a href="/about/">私について</a>
  <a href="/products/">プロダクト</a>
  <a href="/posts/">記事</a>
</nav>
```

`NAV_PAGES` 定数はPC用の型定義のみに使われており、SPナビには活用されていない。

### 何が問題か

- ページを追加・削除するとき2箇所を更新しなければならない
- PC/SP でリンクの差異（SPは「トップページ」へのリンクが追加）が意図的なのか分かりにくい

## 理想の状態

ナビリンクの定義を1箇所に集約する。

```ts
const NAV_LINKS = [
  { label: "トップページ", href: "/", spOnly: true },
  { label: "私について",   href: "/about/" },
  { label: "プロダクト",   href: "/products/" },
  { label: "記事",         href: "/posts/" },
] as const;
```

```tsx
// PC ナビ（spOnly を除外）
<nav aria-label="メインナビゲーション">
  {NAV_LINKS.filter(l => !l.spOnly).map(l => (
    <a href={l.href} className={currentPage === l.label ? styles.current : undefined}>
      {l.label}
    </a>
  ))}
</nav>

// SP ナビ（全リンク）
<nav aria-label="スマホメニュー">
  {NAV_LINKS.map(l => <a href={l.href}>{l.label}</a>)}
</nav>
```

## 移行スコープ

- `presenter.tsx` にナビリンク定数を定義
- PC・SPナビを定数を使ったmapに変更
- `CurrentPage` 型の定義も定数から導出するよう更新
