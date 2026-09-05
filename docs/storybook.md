# yutteee Portfolio UI

ポートフォリオのデザイン判断と、実際に動くコンポーネントを一緒に確認するための資料です。

## 読み方

1. **デザイン原則**: 「テックを抽象で語る」というコンセプト、PC モチーフ、3 つの判断基準。
2. **ライティングガイド**: フォント選定、文字サイズ・行長・行間、見出しの階層、文章の論理構成。
3. **実装ガイド**: テーマ、トークンの使い方、コンポーネントの作り方、アクセシビリティの確認。
4. **トークン**: 色・文字・余白・角丸・影などの実値と見本。Light / Dark を開いて見比べ、表示幅を変えて流動的な文字サイズ・余白を確認できます。
5. **ui / features**: 各コンポーネントの Docs で利用ガイド・プロパティ・実例を確認し、個別のストーリーで操作を試せます。

## 起動と確認

```sh
pnpm storybook
pnpm build-storybook
pnpm check
pnpm test:storybook --run
```

## 資料の更新場所

| 内容 | 正本 | Storybook への反映 |
| --- | --- | --- |
| デザイン原則 | `docs/design-principles.md` | Markdown を直接読み込み |
| ライティング・タイポグラフィ | `docs/writing-guidelines.md` | Markdown を直接読み込み |
| 実装ルール | `docs/design-system.md` | Markdown を直接読み込み |
| この案内 | `docs/storybook.md` | Markdown を直接読み込み |
| コンポーネント利用ガイド | `docs/components/<Name>.md` | 各ストーリーの Docs が直接読み込み |
| トークン | `src/styles/global.css` | 定義から一覧と見本を自動生成 |
| プロパティ・動作例 | 各コンポーネントの `index.stories.tsx` と実装 | 既存の Controls / ストーリー |

文章を変更した場合、Storybook 用に同じ文章を再入力する必要はありません。
