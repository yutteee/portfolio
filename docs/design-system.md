# 実装ガイド

このポートフォリオは Astro + React で構成されています。UI コンポーネントは専用の Context / Provider を必要としません。

## スタイルとテーマ

Storybook は `.storybook/preview.ts` から `destyle.css` と `src/styles/global.css` を読み込みます。ブランドフォント **BIZ UDPGothic** は `.storybook/preview-head.html` で読み込みます。ネットワークにつながらない環境では代替フォントになります。

ライトが既定で、`html.dark` によってダークモードへ切り替わります。色は `--color-text` などのセマンティックトークンを使います。コンポーネントにダーク専用の色定義は不要です。トークンページの Light / Dark で両方を確認できます。

## トークンの使い方

- 色・余白・角丸・文字サイズ・gap・影・padding・margin・枠線色は `var(--...)` を使います。CSS のチェックで強制されます。
- プリミティブ色の直接参照は、1〜2 箇所しか使わない例外的なケースに限ります。
- 本文は `--step-0`、hero のページ見出しは `--step-6`、本文の行長は `--text-max-width` が基準です。
- `--space-s-m` などのペアは画面幅に応じて余白が開閉します。セクション間などの可変余白に使います。
- `--bp-*` は値の管理用です。メディアクエリに CSS 変数は使わず、リテラル値と `/* sync with --bp-md */` などのコメントを併記します。
- すべての実値は `src/styles/global.css` が正本です。Storybook のトークン一覧はこのファイルから読み込みます。

## コンポーネントの構成

- `src/ui/` は見た目を担う純粋なコンポーネントです。
- `src/features/` は機能を担います。Container の `index.tsx` に状態・副作用、`presenter.tsx` に props を描画する処理を置きます。
- props は `export type <Name>Props` として公開します。
- スタイルは `index.module.css` に書き、インライン style は原則使いません。
- アイコンは `react-icons` の `Fi*` 系を使います。
- 関数引数はオブジェクト形式にします。DOM / React などが定めるイベントハンドラのシグネチャは例外です。

## よく使う表現

- 画像ズームは親に `overflow: hidden`、画像に `transform` の 0.3 秒の transition を設定し、hover 時に `scale(1.1)` にします。
- テキストの hover 色には `--color-link` を使います。
- ピル型は `--radius-infinity`、hover 背景は `--color-accent` を使います。
- 一覧リンクは `Button` に `href`、目的がわかる `aria-label`、`endIcon={FiArrowRight}` を渡して構成します。

## コンポーネントを選ぶ

`ui/` の Docs に各コンポーネントの用途・制約・プロパティ・実例をまとめています。`Tag` は既存の Storybook 資料も引き続き参照できます。

`Header`・`Footer`・`AnimationIcon` はサイト固有です。独自のナビゲーション・SNS リンク・アニメーション状態を持つため、汎用部品として使う際はその前提を確認します。Footer の画像は `public/` から Storybook に配信します。

## 確認方法

デザイン段階からコントラスト、ズーム耐性、キーボード操作、フォーカス、具体的な画像の代替テキストを確認します。WCAG 2.1 AA はこのサイトの設計目標であり、この資料の掲載自体が準拠検証の完了を意味するものではありません。

アニメーションは `html.stop` で停止でき、停止状態を `localStorage` に保存できることを確認します。

Storybook で実例・操作・アクセシビリティを確認し、意味のある動作は Vitest で検証します。props をそのまま表示するだけの自明なテストは追加しません。

出典: `.design-sync/conventions.md`、`.agents/skills/ui-design-rules/SKILL.md`、`src/ui/README.md`、`AGENTS.md`。
