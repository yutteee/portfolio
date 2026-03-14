# 依存関係アップデート調査レポート

調査日: 2026-03-14
調査コマンド: `pnpm outdated`

## サマリー

| 分類 | 件数 |
|---|---|
| メジャーアップデート（破壊的変更あり） | 13 |
| マイナーアップデート（機能追加・修正） | 15 |
| パッチアップデート（バグ修正のみ） | 8 |
| **合計** | **36** |

---

## メジャーアップデート（要注意・段階的対応推奨）

### 🔴 Astro 4 → 5

| パッケージ | 現在 (package.json) | 解決済み | 最新 |
|---|---|---|---|
| `astro` | `^4.6.3` | `4.16.18` | `5.18.0` |
| `@astrojs/mdx` | `^2.3.1` | `2.3.1` | `4.3.13` |
| `@astrojs/react` | `^3.6.0` | `3.6.3` | `4.4.2` |
| `@astrojs/check` | `^0.5.10` | `0.5.10` | `0.9.6` |

**対応の難易度: 高**

Astro 5 は Content Layer API、型システムの刷新など多くの破壊的変更を含む。
公式マイグレーションガイドに沿った段階的対応が必要。
`@astrojs/mdx` と `@astrojs/react` も Astro 5 対応版にあわせてアップデートが必要。

参考: https://docs.astro.build/en/guides/upgrade-to/v5/

---

### 🔴 React 18 → 19

| パッケージ | 現在 (package.json) | 最新 |
|---|---|---|
| `react` | `^18.3.1` | `19.2.4` |
| `react-dom` | `^18.3.1` | `19.2.4` |
| `@types/react` | `^18.3.3` | `19.2.14` |
| `@types/react-dom` | `^18.3.0` | `19.2.3` |

**対応の難易度: 中〜高**

React 19 は新しい Compiler、`use` フック、Server Actions など多くの変更を含む。
`@astrojs/react` の React 19 対応バージョンへの更新と同時に行う必要がある。

---

### 🔴 Storybook 9 → 10

| パッケージ | 現在 | 最新 |
|---|---|---|
| `storybook` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/react` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/react-vite` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/addon-a11y` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/addon-docs` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/addon-onboarding` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/addon-vitest` | `^9.0.0` (9.0.6) | `10.2.16` |
| `@storybook/addon-viewport` | `^9.0.8` (9.0.8) | `9.0.8` ← 変化なし |
| `@storybook/test-runner` | `^0.22.0` | `0.24.2` |
| `@chromatic-com/storybook` | `^4.0.0-0` (4.0.0) | `5.0.1` |
| `storybook-addon-test-codegen` | `^2.0.1` | `3.0.1` |

**対応の難易度: 中**

Storybook 10 は React 19 対応が主な変更。`@storybook/addon-viewport` は既に最新。
React 19 アップデートと合わせて行うのが効率的。

---

### 🔴 Vitest 3 → 4

| パッケージ | 現在 (package.json) | 解決済み | 最新 |
|---|---|---|---|
| `vitest` | `^3.1.4` | `3.2.2` | `4.0.18` |
| `@vitest/browser` | `^3.1.4` | `3.2.2` | `4.0.18` |
| `@vitest/coverage-v8` | `^3.1.4` | `3.2.2` | `4.0.18` |

**対応の難易度: 中**

Vitest 4 は Vite 7 ベース。テスト設定ファイルの一部変更が必要な可能性あり。

---

### 🔴 Biome 1 → 2

| パッケージ | 現在 (固定) | 最新 |
|---|---|---|
| `@biomejs/biome` | `1.8.3` | `2.4.6` |

**対応の難易度: 中**

Biome 2 は設定スキーマが変更されている（`biome.json` の更新が必要）。
新しいリントルールの追加により既存コードに警告が出る可能性あり。
`biome migrate` コマンドで自動マイグレーション可能。

参考: https://biomejs.dev/blog/biome-v2/

---

### 🟡 その他のメジャーアップデート

| パッケージ | 現在 | 最新 | 備考 |
|---|---|---|---|
| `jsdom` | `^25.0.1` | `28.1.0` | テスト環境。破壊的変更の確認が必要 |
| `@types/jsdom` | `^21.1.7` | `28.0.0` | jsdom に合わせて更新 |
| `chromatic` | `^12.0.0` | `15.2.0` | CI/CD への影響を確認 |
| `astro-seo` | `^0.8.4` | `1.1.0` | APIの変更確認が必要 |
| `satori` | `^0.10.14` | `0.25.0` | OGP画像生成に使用。APIの変更確認が必要 |

---

## マイナー・パッチアップデート（比較的安全）

### 🟢 対応しやすいアップデート

| パッケージ | 現在 (package.json) | 解決済み | 最新 |
|---|---|---|---|
| `@astrojs/rss` | `^4.0.5` | `4.0.12` | `4.0.15` |
| `@astrojs/sitemap` | `3.1.4` (固定) | `3.1.4` | `3.7.0` |
| `@marp-team/marp-core` | `^4.1.0` | `4.1.0` | `4.3.0` |
| `@testing-library/jest-dom` | `^6.6.3` | `6.6.3` | `6.9.1` |
| `@testing-library/react` | `^16.3.0` | `16.3.0` | `16.3.2` |
| `@testing-library/user-event` | `^14.6.1` | `14.6.1` | `14.6.1` ← 変化なし |
| `astro-icon` | `^1.1.0` | `1.1.5` | `1.1.5` |
| `gsap` | `^3.12.5` | `3.13.0` | `3.14.2` |
| `playwright` | `^1.52.0` | `1.52.0` | `1.58.2` |
| `plop` | `^4.0.1` | `4.0.1` | `4.0.5` |
| `react-icons` | `^5.5.0` | `5.5.0` | `5.6.0` |
| `sharp` | `^0.34.3` | `0.34.3` | `0.34.5` |
| `typescript` | `^5.4.5` | `5.8.3` | `5.9.3` |
| `@iconify-json/clarity` | `^1.1.13` | `1.2.2` | `1.2.4` |
| `@iconify-json/formkit` | `^1.1.8` | `1.2.2` | `1.2.2` ← 変化なし |
| `@iconify-json/lets-icons` | `^1.1.2` | `1.2.1` | `1.2.2` |
| `@iconify-json/weui` | `^1.1.0` | `1.2.2` | `1.2.4` |
| `@resvg/resvg-js` | `^2.6.2` | `2.6.2` | `2.6.2` ← 変化なし |
| `destyle.css` | `^4.0.1` | `4.0.1` | `4.0.1` ← 変化なし |
| `the-new-css-reset` | `^1.11.2` | `1.11.3` | `1.11.3` |

---

## 推奨対応順序

### Phase 1: 安全なアップデート（即対応可能）

キャレット指定のマイナー・パッチアップデートをまとめて適用する。

```bash
pnpm update --latest \
  @astrojs/rss \
  @marp-team/marp-core \
  @testing-library/jest-dom \
  @testing-library/react \
  astro-icon \
  gsap \
  playwright \
  plop \
  react-icons \
  sharp \
  typescript \
  "@iconify-json/clarity" \
  "@iconify-json/lets-icons" \
  "@iconify-json/weui" \
  the-new-css-reset
```

また、`@astrojs/sitemap` の固定を解除して `^3.7.0` にする（[pinned-dependency-versions.md](./pinned-dependency-versions.md) も参照）。

### Phase 2: Biome 2 アップデート

```bash
pnpm add -D @biomejs/biome@latest
pnpm biome migrate
pnpm check  # 新ルールへの対応
```

### Phase 3: Vitest 4 アップデート

```bash
pnpm add -D vitest@latest @vitest/browser@latest @vitest/coverage-v8@latest
pnpm test:unit  # テストが通ることを確認
```

### Phase 4: Astro 5 + React 19 アップデート（最も影響大）

Astro 5 公式マイグレーションガイドに従って実施。
`react`、`@astrojs/react`、`@astrojs/mdx` を同時にアップデートする。

```bash
pnpm dlx @astrojs/upgrade
```

公式の `@astrojs/upgrade` CLI を使うと依存関係の整合性を自動で取ってくれる。

### Phase 5: Storybook 10 アップデート（Phase 4 完了後）

React 19 対応後に Storybook のマイグレーションを行う。

```bash
pnpm dlx storybook@latest upgrade
```

---

## 補足: `pnpm outdated` の "missing" 表示について

`pnpm outdated` の Current 列が `missing (wanted x.x.x)` となっているのは、
`node_modules` が未インストールの状態で実行したためであり、パッケージが存在しないわけではない。
実際のインストール済みバージョンは `package.json` の `^` 範囲で解決されたバージョンが使われている。

---

## 関連 Issue

- [pinned-dependency-versions.md](./pinned-dependency-versions.md) — `@astrojs/sitemap` / `@biomejs/biome` が固定されている問題
- [renovate-setup.md](./renovate-setup.md) — 自動アップデート設定（Renovate）
