# AGENTS.md

このファイルはリポジトリで作業する際の Codex へのガイダンスを提供します。

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
- **意味のあるテスト項目がある場合のみ `index.test.tsx` を作成する**。渡した props がそのまま出力されるかを確認するだけの自明なテスト（検証価値のないテスト）は作らない

## pnpmのセキュリティとインストールエラー

- `pnpm-workspace.yaml`の対策は必須。エラー回避のために7日待機（`minimumReleaseAge: 10080`）を短縮したり、`minimumReleaseAgeStrict`、`trustPolicy`、`strictDepBuilds`、`blockExoticSubdeps`、完全性検査を弱めたりしない。`minimumReleaseAgeIgnoreMissingTime: true`、`trustLockfile: true`、`dangerouslyAllowAllBuilds: true`も禁止。
- CLI・環境変数・グローバル設定による上書きや、`--no-frozen-lockfile`による検証回避も禁止。
- 除外設定（`minimumReleaseAgeExclude`、`trustPolicyExclude`等）や`allowBuilds`の許可追加は、根拠と対象バージョンを提示し、ユーザーの明示的な承認を得てから行う。今回の作業の許可は、対策を弱める許可を含まない。
- 依存更新後は`pnpm audit`を実行する。公開待機やスクリプト制限だけでは既知の脆弱性は解消しない。
- 出典: https://pnpm.io/supply-chain-security

エラー時の手順:
1. エラーコード・対象パッケージ・バージョンを記録し、公式情報で原因を確認する。
2. 公開待機中なら待つか、条件を満たす修正版を選ぶ。信頼度低下は適合する依存へ更新する。未承認スクリプトは内容を確認して承認を求める。通信障害は接続を確認する。
3. ロック不整合は対策を維持した正規の更新操作で修正する。既存ロック自体が拒否される場合、退避して再解決し、失敗したら元に戻す。
4. `pnpm install --frozen-lockfile`と関連チェックを再実行する。解決できない場合は原因と未完了事項を報告し、停止する。

## セッション開始フック

`.Codex/hooks/session-start.sh` にセッション開始フックが設定されています：
- リモート環境（Codex on the web）でのみ実行
- git のユーザー情報を設定
- `pnpm install` で依存関係をインストール（非同期）

フックは `.Codex/settings.json` に登録されています。
