# Renovate による依存関係の自動更新

## 概要

依存関係が古くなりがちな問題を解消するため、Renovate を導入して自動更新 PR を発行する仕組みを整える。

## 実装内容

`renovate.json` を作成済み。GitHub の Renovate App をインストールすれば即座に動作する。

### 設定のポイント

| 設定 | 値 | 理由 |
|---|---|---|
| `schedule` | 月曜朝 9 時前（JST） | 週明けにまとめて確認できる |
| `stabilityDays` | 7 日 | `pnpm-workspace.yaml` の `minimumReleaseAge: 10080min` に揃える |
| `lockFileMaintenance` | 月 1 回 | 間接依存の drift を防ぐ |
| パッチ更新 | 自動マージ（CI 通過後） | 低リスクな更新を省力化 |
| メジャー更新 | 手動レビュー必須 | 破壊的変更への対応 |

### グループ化ルール

| グループ名 | 対象パッケージ |
|---|---|
| `astro` | `astro`, `@astrojs/*` |
| `storybook` | `storybook`, `@storybook/*`, `@chromatic-com/*` |
| `testing` | `vitest`, `@vitest/*`, `@testing-library/*`, `playwright` |
| `react` | `react`, `react-dom`, `@types/react`, `@types/react-dom` |

グループ化することで、互いに依存しているパッケージが別々の PR で更新されて壊れるリスクを減らす。

## 有効化手順

1. GitHub Renovate App をリポジトリにインストールする
   - https://github.com/apps/renovate
2. インストール後、Renovate が自動で初回の依存関係スキャンを実行し PR を発行する

## 注意事項

### pnpm-workspace.yaml の `onlyBuiltDependencies` との関係

`pnpm-workspace.yaml` には `strictDepBuilds: true` が設定されており、ビルドスクリプトの実行が許可されたパッケージリスト（`onlyBuiltDependencies`）が定義されている。

Renovate が新しいパッケージを追加するような PR を出した場合（依存の依存など）、そのパッケージがビルドスクリプトを必要とするなら `onlyBuiltDependencies` への追記が別途必要。

### Node.js・pnpm バージョンの自動更新について

Renovate の `nvm`・`dockerfile`・`github-actions` マネージャーにより以下も更新対象になる：

- `.nvmrc`（Node.js バージョン）
- `.devcontainer/Dockerfile`（Node.js イメージ、corepack pnpm バージョン）
- `.github/workflows/*.yml`（`actions/setup-node` の `node-version`、`pnpm/action-setup` の `version`）

ただし現状は各ファイルで指定が異なるため（→ `nodejs-version-inconsistency.md`・`pnpm-version-inconsistency.md` 参照）、Renovate が個別に PR を出して余計に分散する可能性がある。

**推奨**: 先に Node.js・pnpm バージョンを統一してから Renovate を有効化する。または GitHub Actions で `node-version-file: '.nvmrc'` を使い `.nvmrc` を Single Source of Truth にする。
