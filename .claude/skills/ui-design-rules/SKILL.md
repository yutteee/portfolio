---
name: ui-design-rules
description: このポートフォリオの UI を新規作成・変更するときのデザインルール集。デザイントークンの使い方、コンポーネントの実装パターン、アクセシビリティ規約、ダークモード対応を定義する。AI が画面・コンポーネント・CSS を生成する際は必ず参照すること。
user-invocable: true
---

# UI デザインルール

UI を作る前に、まず以下を読むこと。ここには**それらに書かれていない運用ルールだけ**を書く。

- 技術スタック・ディレクトリ構成・コードスタイル（Biome / 引数オブジェクト化）・テスト方針・`pnpm plop`: @CLAUDE.md
- `src/ui/` のファイル構成・TDD 方針: @src/ui/README.md
- **デザイントークンの実体**（色・タイポ・余白・角丸・影・枠線・z-index・行間・字間・ブレークポイント）: `src/styles/global.css` の `:root`。**変数名で用途がわかる**ので、使うトークンは直接ここを見ること。

## トークンの使い方（global.css の変数名だけでは分からない運用）

1. **ハードコード禁止**。色・余白・角丸・font-size・gap・box-shadow・padding・margin・border-color は必ず `var(--...)`（stylelint `declaration-strict-value` で強制）。
2. **色はセマンティック層（`--color-text` 等）を使う**。プリミティブ（`--color-navy` 等）の直接参照は1〜2箇所の例外時のみ。
3. **ダークモード対応は書かない**。セマンティックトークンを使えば `:root.dark` のマッピングで自動で切り替わる。コンポーネント側にダーク用の色を書かない。
4. **タイポの基準**: `--step-0` が本文、`--step-6` は hero（ページ見出し）専用。本文の行長は `--text-max-width`。
5. **`--space-*-*`（ペア）** はビューポートに応じて余白自体が開閉する動的スペース。セクション間など可変にしたい余白に使う。
6. **ブレークポイント**: `--bp-*` は `@media` 内では使えない。`@media (max-width: <px>)` とリテラルで書き、直後に `/* sync with --bp-* */` コメントを必ず付けて同期させる。

## コンポーネント実装パターン（@src/ui/README.md の補足）

- **`src/ui/`** = 見た目だけの純粋コンポーネント。**`src/features/`** = ロジックを持つ機能コンポーネントで、**Container/Presenter パターン**を使う:
  - `index.tsx` … state / hooks / 副作用（Container）→ `<NamePresenter ... />` を返す
  - `presenter.tsx` … props を受け取って描画するだけ（純粋）
- props 型は `export type <Name>Props` で公開。
- スタイルは `index.module.css`（CSS Modules）。インライン style は原則使わない。
- アイコンは `react-icons`（`Fi*` 系）。装飾アイコンには `aria-hidden`。
- よく使う見た目: ホバーで画像ズーム（親 `.mask{overflow:hidden}` + `.image{transition:transform .3s}` → `:hover .image{transform:scale(1.1)}`）、ホバーでテキストを `--color-link`、ピルボタンは `--radius-infinity` + ホバー背景 `--color-accent`。

## アクセシビリティ（必須）

- ボタンは `<button type="button">` + `aria-label`、トグルは `aria-pressed`。
- 外部リンクは `target="_blank"` + `rel="noopener noreferrer"`、現在地は `aria-current="page"`、ナビは `<nav aria-label="...">`。
- `list-style:none` の `<ol>/<ul>` には `role="list"` を付与（Safari/VoiceOver 対策。意図を `biome-ignore` コメントで明示）。
- 画像には意味のある `alt`。タップターゲットは最低 44×44px。
