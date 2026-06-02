# CLAUDE.md

このファイルはリポジトリで作業する際の Claude Code へのガイダンスを提供します。

## プロジェクト概要

yutteee のポートフォリオサイトです。Astro + React で構築されており、https://yutteee.pages.dev にデプロイされています。

## 技術スタック

- **フレームワーク**: Astro 4（MDX・React・サイトマップ・アイコン統合）
- **スタイリング**: カスタム CSS（`destyle.css` / `the-new-css-reset`）
- **アニメーション**: GSAP
- **アイコン**: `astro-icon`（Iconify アイコンセット）
- **OGP 画像生成**: Satori + `@resvg/resvg-js` + Sharp
- **コンポーネント**: React（インタラクティブアイランド）
- **パッケージマネージャー**: pnpm（必須 — npm や yarn は使用しないこと）
- **リンター / フォーマッター**: Biome
- **テスト**: Vitest（ユニット） + Storybook（ビジュアル / コンポーネント）
- **コンポーネント開発**: Storybook + Chromatic

## よく使うコマンド

```bash
# 開発サーバー起動（画像コピーも実行）
pnpm dev

# 本番ビルド（型チェック + ビルド）
pnpm build

# リント・フォーマットチェック
pnpm check

# 全テスト実行（ユニット + Storybook）
pnpm test

# ユニットテストのみ実行
pnpm test:unit

# Storybook ビジュアルテストのみ実行
pnpm test:storybook

# Storybook 開発サーバー起動
pnpm storybook

# plop でコンポーネントの雛形生成
pnpm plop
```

## ソースディレクトリ構成

```
src/
  components/    # 共通 Astro コンポーネント
  content/       # コンテンツコレクション（記事など）
  data/          # 静的データ（経歴・作品・外部ブログ）
  features/      # 機能単位のコンポーネント（Header・Footer など）
  layouts/       # Astro ページレイアウト
  marp-themes/   # Marp プレゼンテーションテーマ
  pages/         # Astro ページ・API ルート
  styles/        # グローバル CSS
  ui/            # 基本 UI コンポーネント
  utils/         # ユーティリティ関数
```

## コードスタイル

リント・フォーマットには Biome を使用（`biome.json` で設定）：
- インデント: スペース 2 つ
- 推奨リントルールを有効化
- コミット前に `pnpm check` を実行すること

### 関数引数のオブジェクト化

関数の引数は **1個でも必ずオブジェクト形式** で受け取る。

```ts
// NG
function scrollToSlide(target: number) { ... }
scrollToSlide(3);

// OK
function scrollToSlide({ target }: { target: number }) { ... }
scrollToSlide({ target: 3 });
```

理由: 呼び出し側で引数名が明示されるため可読性が高く、順序ミスを防げる。将来引数が増えた時の差分も最小になる。

例外: DOM/React のイベントハンドラなど、シグネチャがフレームワーク側で固定されている関数（`(e: KeyboardEvent) => void` 等）。

## テストについて

- ユニットテストは `src/**/*.test.tsx` に配置し、jsdom 環境で実行
- Storybook テストは vitest storybook 設定を使用
- Header のテーマ永続化テストが一部失敗中（既存の問題でセッション設定とは無関係）

## セッション開始フック

`.claude/hooks/session-start.sh` にセッション開始フックが設定されています：
- リモート環境（Claude Code on the web）でのみ実行
- git のユーザー情報を設定
- `pnpm install` で依存関係をインストール（非同期）

フックは `.claude/settings.json` に登録されています。
