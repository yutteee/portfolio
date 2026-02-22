# pnpm バージョン不一致

## 概要

pnpm のバージョンが環境間で大きく乖離しており、ロックファイルの互換性が壊れるリスクがある。

## 現状

| 設定ファイル | pnpm バージョン |
|---|---|
| `.devcontainer/Dockerfile` | `pnpm@10.27`（corepack） |
| `.github/workflows/chromatic.yml` | `8`（pnpm/action-setup） |
| `.github/workflows/component-test.yml` | `8`（pnpm/action-setup） |
| `pnpm-lock.yaml` | lockfileVersion: `9.0`（pnpm v9 以上が必要） |

## 問題点

- `pnpm-lock.yaml` の lockfileVersion が `9.0` のため、pnpm v8 では読み込めない
- GitHub Actions（pnpm v8）が `pnpm install` を実行すると lockfileVersion の不一致でエラーになる可能性がある
- devcontainer（pnpm v10）と CI（pnpm v8）で依存解決の挙動が異なる可能性がある

## 対応案

- GitHub Actions の pnpm バージョンを devcontainer に揃える（`pnpm@10`）
- `package.json` の `packageManager` フィールドでバージョンを固定する

```json
// package.json
"packageManager": "pnpm@10.27.0"
```

- これにより corepack が自動的に正しいバージョンを使用するようになる
