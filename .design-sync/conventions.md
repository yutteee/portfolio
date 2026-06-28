# yutteee Portfolio UI — 規約

これらの React コンポーネントはポートフォリオサイト（Astro + React）由来です。各コンポーネントは**スタンドアロン**で、ラップすべき React の Context / Provider はありません。テーマ設定はすべて `styles.css` で配信されるグローバル CSS（デザイントークン + リセット）と、ダークモード用の `<html>` クラス1つで行います。`styles.css` を読み込めばコンポーネントはスタイルされます。

## セットアップとテーマ

- **`styles.css` を読み込む。** このファイルは `tokens/destyle.css`（CSS リセット — コンポーネントはこれを前提とします。無いとネイティブの `<button>`/`<a>`/リスト のスタイルが漏れます）、ブランドフォント **BIZ UDPGothic**（リモート `@import`）、`_ds_bundle.css`（全 `--*` トークン定義 + コンポーネントスタイル）を `@import` します。Provider も JS のテーマ設定も不要です。
- **ダークモード:** ルートの `<html>` 要素に `dark` クラスを付与します（`document.documentElement.classList.add("dark")`）。ライトがデフォルト（クラス無し）です。セマンティックな `--color-*` トークンが自動で切り替わります — 色を直接ハードコードしないでください。
- **フォント:** `--font-family-default` は `"BIZ UDPGothic", sans-serif` で、`html` に適用済みです。

## スタイリングの作法 — CSS カスタムプロパティ（デザイントークン）

**ユーティリティクラスも CSS-in-JS もありません。** コンポーネントは自身のスタイルを持ちます。あなた自身のレイアウト用スタイルは `var(--token)` で組んでください。色は必ず**セマンティック**トークン（テーマ対応）を使い、生のプリミティブ（`--color-navy` など）は使わないでください。

| 種別 | トークン |
|---|---|
| 色（セマンティック） | `--color-background` `--color-surface` `--color-text` `--color-text-inverse` `--color-border` `--color-link` `--color-accent` |
| フォントサイズ（流動的） | `--step--2` `--step--1` `--step-0` `--step-1` … `--step-6` |
| 余白（流動的） | `--space-4xs` `--space-3xs` `--space-2xs` `--space-xs` `--space-s` `--space-m` `--space-l` `--space-xl` `--space-2xl` `--space-3xl`（ペア `--space-s-m`, `--space-m-l`, `--space-l-xl` も） |
| 角丸 | `--radius-none` `--radius-xs` `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-infinity` |
| 行送り | `--leading-tight` `--leading-snug` `--leading-relaxed` `--leading-loose` `--leading-paragraph` |
| 字間 | `--tracking-tight` `--tracking-normal` `--tracking-wide` `--tracking-wider` |
| 線幅 | `--border-width-none` `--border-width-sm` `--border-width-md` `--border-width-lg` |
| 影 | `--shadow-elevation-2` `--shadow-elevation-4` `--shadow-elevation-8` `--shadow-elevation-12` |
| z-index | `--z-index-background` `--z-index-content` `--z-index-header` `--z-index-modal` `--z-index-toast` |
| ブレークポイント | `--bp-sm`（40rem）`--bp-md`（64rem）`--bp-md-plus` |
| その他 | `--text-max-width` `--font-weight-normal` |

## 正となる情報の場所

- `styles.css` とその `@import` クロージャ（`tokens/destyle.css`, `_ds_bundle.css`）— トークンの実値とコンポーネント CSS の正本。スタイリング前に参照してください。
- コンポーネントごとの API と使い方: `components/<group>/<Name>/<Name>.prompt.md` と `.d.ts`。
- グループ: **ui/** = `BlogPost` `Breadcrumb` `Button` `IconButton` `PageTitle` `ProductItem` `Scrap`；**features/** = `Header` `Footer` `AnimationIcon`。`Scrap` は日付・タイトル・概要を常に表示し、本文をネイティブ `details`/`summary` で展開する記録カードです（hydration 不要）。
- `IconButton` の `icon` prop は **react-icons** の `IconType` を取ります（例: `react-icons/fi` の `FiMenu`）。`Header`/`Footer`/`AnimationIcon` はアプリ固有です（独自のナビ・ソーシャルリンク・アニメーション切替）。

## 慣用的な実装例

```tsx
import { IconButton } from "<このパッケージ>";
import { FiMenu } from "react-icons/fi";

export function Toolbar() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-2xs)",
        padding: "var(--space-s)",
        background: "var(--color-surface)",
        border: "var(--border-width-sm) solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <IconButton label="メニュー" icon={FiMenu} handleClick={() => {}} />
    </div>
  );
}
```
