# package-lock.json と pnpm-lock.yaml の共存

## 概要

pnpm をパッケージマネージャーとして使用しているにもかかわらず、`package-lock.json`（npm 用）が残存している。

## 現状

- `pnpm-lock.yaml`（12,173行）: pnpm によるアクティブなロックファイル
- `package-lock.json`（22,139行）: npm 用のロックファイルが残存

## 問題点

- pnpm 運用中に `package-lock.json` が存在すると、誤って `npm install` を実行した際に依存関係が壊れる
- リポジトリのサイズが無駄に増加する（22,000行以上）
- 2つのロックファイルが別々に依存関係を管理するため、内容が乖離している可能性がある
- `pnpm-workspace.yaml` で pnpm を前提とした設定をしているにもかかわらず、npm 用ファイルが混在している

## 対応案

- `package-lock.json` を削除する
- `.gitignore` に `package-lock.json` を追加して再生成を防ぐ

```gitignore
# .gitignore
package-lock.json
```

- `package.json` の `packageManager` フィールドで pnpm を明示することで、他のパッケージマネージャーの誤使用を防ぐ
