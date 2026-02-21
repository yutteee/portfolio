# Node.js バージョン不一致

## 概要

開発環境・CI/CD環境で参照する Node.js バージョンが統一されておらず、環境差異による不具合リスクがある。

## 現状

| 設定ファイル | Node.js バージョン |
|---|---|
| `.nvmrc` | `20` |
| `.devcontainer/Dockerfile` | `24.12.0` |
| `.github/workflows/chromatic.yml` | `20` |
| `.github/workflows/component-test.yml` | `24` |

## 問題点

- ローカル開発（`.nvmrc: 20`）と devcontainer（`24`）で Node.js バージョンが異なる
- CI ワークフロー間でも chromatic は Node 20、unit test は Node 24 とバラバラ
- Astro の engines 要件は `^18.17.1 || ^20.3.0 || >=21.0.0` で Node 24 は `>=21.0.0` に該当するが、Node 20 と 24 での動作差異が検証されていない

## 対応案

- Node.js バージョンを1つに統一する（Node 20 LTS または Node 24 LTS）
- `.nvmrc`・Dockerfile・GitHub Actions すべてで同じバージョンを参照する
- `package.json` の `engines` フィールドで明示的にサポートバージョンを宣言する

```json
// package.json
"engines": {
  "node": ">=20.3.0"
}
```
