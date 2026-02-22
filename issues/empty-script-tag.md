# トップページに空の script タグが残っている

## 現状の問題

`src/pages/index.astro` の末尾に内容のない `<script>` タグが残っている。

```astro
<!-- src/pages/index.astro:24 -->
<script></script>
```

### 何が問題か

- 不要なコードが残っており、過去の作業の残骸と思われる
- Astro は空の `<script>` タグでもバンドル処理を行うため、わずかながらビルドに影響する可能性がある

## 理想の状態

削除する。

## 移行スコープ

- `src/pages/index.astro` の `<script></script>` を削除
