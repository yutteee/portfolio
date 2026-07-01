# Obsidian からブログ / スクラップを書く

Obsidian で執筆し、`pnpm blog:import` でリポジトリへ反映する運用のガイドです。

## 全体像

```
Obsidian で執筆 (blog/ · scraps/ · attachments/)
  ↓ pnpm blog:import
src/content/posts · src/content/scraps へ変換・コピー
  ↓ pnpm dev で確認
  ↓ commit → PR → merge
Cloudflare Pages にデプロイ
```

- Obsidian 側は **wikilink（`![[...]]`）と共有 `attachments/` フォルダ** をそのまま使えます。パスの変換はインポートスクリプトが行います。
- vault のパスは既定で iCloud の `ObsidianVault` を見ます。別の場所を使う場合は環境変数 `OBSIDIAN_VAULT` で上書きできます。

## Obsidian の初期設定（初回のみ）

`設定 → ファイルとリンク`:

- **添付ファイルの既定の保存先**: 「指定したフォルダ」→ `attachments`
- **内部リンクの形式（Use [[Wikilinks]]）**: ON のままで OK
- vault 直下に `blog/` と `scraps/` フォルダを作成し、そこにノートを置く

## ブログ記事の書き方

`blog/` にノートを1記事1ファイルで作成します。ファイル名は日本語タイトルで構いません（公開時のフォルダ名は frontmatter から決まります）。

```yaml
---
title: 記事タイトル
pubDate: "2026-07-01"
description: 一覧・OGP・meta に使う説明
draft: true          # 公開したくない間は true（インポート対象外）
# marp: true         # スライド記事のとき
# theme: custom-theme
---
```

- **公開する時**: `draft` を `false` にするか行ごと削除する。
- **記事フォルダ名**: `pubDate` から `YYYYMMDD` を生成します。同じ日付で複数記事を出すときは `slug: 任意の名前` を frontmatter に足すと衝突を避けられます。

### 画像

画像を貼り付けると `attachments/` に保存され、本文に `![[ファイル名.png]]` が挿入されます。**alt テキスト（代替テキスト）を必ず付けてください**:

```
![[diagram.png|攻撃フロー図。感染から情報漏洩までの3ステップを示している。]]
```

- `|` 以降が alt になります。alt 未設定の画像は `pnpm blog:import` 実行時に警告が出ます。
- インポート時に画像は記事フォルダへコピーされ、`![alt](./diagram.png)` に変換されます。
- Marp 記事では幅指定などをそのまま alt 部分に書けます（例: `![[icon.png|オカメインコの写真 w:300 h:300]]`）。

## スクラップの書き方

`scraps/` にノートを作成します。frontmatter は `title` / `pubDate` / `description`。**画像の扱いはブログと全く同じ**で、`![[...]]` で貼れば記事フォルダへコピー・変換されます（alt も同様に付けてください）。

- 公開フォルダ名は `slug`（なければノートのファイル名）になります。スクラップは URL 的な英語スラッグを使うことが多いので、frontmatter に `slug: preconnect` のように指定するか、ノートのファイル名を英語にしておくのがおすすめです。

```yaml
---
title: link rel="preconnect"
pubDate: "2026-05-17"
description: preconnect の説明
slug: preconnect
---
```

## 公開フロー

```bash
# 1. Obsidian で draft を外す
# 2. リポジトリで反映
pnpm blog:import

# 3. ローカルで確認
pnpm dev            # /posts/<slug> と /scrap を確認

# 4. コミットして PR
```

`pnpm blog:import` は冪等です（再実行で上書き）。実行後に、コピーされた記事・画像件数と、alt 欠落やスキーマ不足の警告が一覧表示されます。

## 既存記事を Obsidian へ移行する（初回のみ）

リポジトリに既にある記事・スクラップを Obsidian vault 側へ書き出します。

```bash
pnpm blog:export
```

- `src/content/posts/*` → `blog/<タイトル>.md`（同居画像は `attachments/` へ、リンクは `![[...]]` へ変換）
- `src/content/scraps/*` → `scraps/<タイトル>.md`（ブログと同じく画像も `attachments/` へ変換）
- リポジトリ側の元ファイルは削除しません。移行内容を確認したうえで手動で判断してください。

## 別 vault を使う場合

```bash
OBSIDIAN_VAULT="/path/to/vault" pnpm blog:import
```
