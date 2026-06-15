---
name: ui-design-rules
description: このポートフォリオの UI を新規作成・変更するときのデザインルール集。デザイントークン（色・タイポ・余白・角丸・影・z-index）、コンポーネントの実装パターン、アクセシビリティ規約、ダークモード対応を定義する。AI が画面・コンポーネント・CSS を生成する際は必ず参照すること。
user-invocable: true
---

# UI デザインルール

yutteee のポートフォリオの UI を作るための規約。**新しい値をハードコードせず、必ず既存トークンを使う**ことが大原則。トークンは `src/styles/global.css` の `:root` で定義されている。

## 絶対ルール（最優先）

1. **色・余白・角丸・font-size・gap・box-shadow・padding・margin・border-color は `var(--...)` トークンのみ**。生の値はハードコードしない（stylelint `declaration-strict-value` で強制される）。
2. **色はセマンティック層（`--color-text` 等）を使う**。プリミティブ（`--color-navy` 等）の直接参照は1〜2箇所の例外時のみ。
3. **ダークモード対応は自動**。セマンティックトークンを使えば `:root.dark` のマッピングで切り替わるので、コンポーネント側でダーク用の色を書かない。
4. **スタイルは `index.module.css`（CSS Modules）に書く**。インライン style は原則使わない。
5. レスポンシブの分岐は `@media (max-width: <px>)` を使い、**直後に `/* sync with --bp-* */` コメントを必ず付ける**（`--bp-*` 変数は @media 内で使えないため手動同期する運用）。

## デザイントークン早見表

### 色（セマンティック → 用途）
| トークン | 用途 | Light | Dark |
|---|---|---|---|
| `--color-background` | ページ背景 | pale `#f0f0f0` | deep-navy `#04345c` |
| `--color-surface` | カード/前面の面 | white | black |
| `--color-text` | 本文テキスト | navy `#041b47` | pale |
| `--color-text-inverse` | 反転テキスト（濃い面の上） | pale | deep-navy |
| `--color-border` | 罫線・枠線 | navy | pale |
| `--color-link` | リンク・強調・ホバー時の文字色 | blue `#023aa2` | mint `#a8fff5` |
| `--color-accent` | アクセント（ボタンホバー背景等） | sky `#84c5ea` | dark-cyan `#015483` |

プリミティブ（直接参照は避ける）: `--color-white` `--color-black` `--color-pale` `--color-navy` `--color-deep-navy` `--color-sky` `--color-blue` `--color-mint` `--color-dark-cyan`

### タイポグラフィ（Fluid Type Scale / Utopia）
本文 = `--step-0`（16→20px）を基準とした Minor Third〜Major Third。
`--step--2` `--step--1` `--step-0` `--step-1` `--step-2` `--step-3` `--step-4` `--step-5` `--step-6`（hero 専用）
- 補助テキスト/メタ: `--step--1`、バッジ: `--step--2`
- カードタイトル: `--step-0`〜`--step-1`、見出し: `--step-2` 以上
- ページ見出し(h1): `--step-6`

行長（measure）: 本文の `max-width` は `--text-max-width`（全角40字相当）。

### 余白（Fluid Space Scale / T-shirt サイズ）
`--space-4xs` `--space-3xs` `--space-2xs` `--space-xs` `--space-s` `--space-m` `--space-l` `--space-xl` `--space-2xl` `--space-3xl`
ビューポートで開閉するペア: `--space-s-m` `--space-m-l` `--space-l-xl`
- 要素内の細かい gap: `--space-2xs`〜`--space-s`
- セクション間: `--space-l`〜`--space-3xl`

### 角丸
`--radius-none`(0) `--radius-xs`(2) `--radius-sm`(4) `--radius-md`(8) `--radius-lg`(12) `--radius-xl`(16) `--radius-infinity`(999)
- 画像・カード: `--radius-md`、バッジ: `--radius-sm`、ピル/丸ボタン: `--radius-infinity`

### 影（elevation）
`--shadow-elevation-2` / `-4` / `-8` / `-12`（数字が大きいほど浮く）。前面に浮かせる要素に使う。

### 枠線幅
`--border-width-sm`(0.5) `--border-width-md`(1) `--border-width-lg`(2)

### z-index（レイヤー）
`--z-index-background`(0) `--z-index-content`(10) `--z-index-header`(100) `--z-index-modal`(200) `--z-index-toast`(300)
重なり順を扱うときは生の数値ではなくこのトークンを使う。

### 行間・字間（テキストブロック向け）
行間: `--leading-tight`(1) `--leading-snug`(1.5) `--leading-relaxed`(1.6) `--leading-loose`(1.75) `--leading-paragraph`(2)
字間: `--tracking-tight/normal/wide/wider`

### その他
- ブレークポイント: `--bp-sm`(40rem) `--bp-md`(64rem=1024px) `--bp-md-plus`
- フォント: `--font-family-default`（"BIZ UDPGothic"）、太さ: `--font-weight-normal`(400)

## コンポーネント実装パターン

### ファイル構成（`pnpm plop` で雛形生成）
- **`src/ui/<Name>/`** — 見た目だけの汎用 UI。ロジックを持たない純粋コンポーネント。
  ```
  index.tsx          # 見た目・a11y・props 設計
  index.module.css   # スタイル
  index.stories.tsx  # 各 props パターン
  index.test.tsx     # ユニットテスト（TDD）
  ```
- **`src/features/<Name>/`** — 機能を持つコンポーネント。ロジックとビューを分離する **Container/Presenter パターン**:
  - `index.tsx` … state/hooks/副作用（Container）→ `<NamePresenter ... />` を返す
  - `presenter.tsx` … props を受けて描画するだけ（純粋）
  - 上記 4 ファイル + `presenter.tsx`

### コーディング規約
- **props 型は `export type <Name>Props`** で公開。
- **関数引数は1個でもオブジェクト形式**で受ける（`fn({ target })`）。例外: フレームワーク固定シグネチャのイベントハンドラ。
- React は `import type React from "react"`（型のみ）。ref が要るときだけ `forwardRef` + `displayName`。
- アイコンは `react-icons`（`Fi*` 系を多用）。装飾アイコンには `aria-hidden`。

### アクセシビリティ（必須）
- ボタンは `<button type="button">` + `aria-label`、トグルは `aria-pressed`。
- リンクの外部遷移は `target="_blank"` + `rel="noopener noreferrer"`。
- 現在地は `aria-current="page"`。ナビは `<nav aria-label="...">`。
- `list-style: none` の `<ol>/<ul>` には `role="list"` を付与（Safari/VoiceOver 対策。`biome-ignore` コメントで意図を明示）。
- 画像には意味のある `alt`。タップターゲットは最低 44×44px。

### よく使う見た目の型
- ホバーで画像ズーム: `.image { transition: transform 0.3s } .parent:hover .image { transform: scale(1.1) }`、はみ出しは親 `.mask { overflow: hidden }`。
- ホバーでテキスト色 → `--color-link`。
- ピルボタン: `border-radius: var(--radius-infinity)` + ホバー背景 `--color-accent`。

## テスト/Storybook
- TDD（テスト→実装→リファクタ）。`index.test.tsx` は React Testing Library + Vitest（jsdom）で **ロール・属性・テキスト**を検証。
- `index.stories.tsx` は `title: "ui/<Name>"`（features は `"features/<Name>"`）、`tags: ["autodocs"]`、`parameters.docs.description.component` に用途を日本語で記述し、props パターンごとに Story を用意。

## 仕上げ
変更後は必ず `pnpm check`（Biome）/ stylelint / `pnpm test` を通す。
