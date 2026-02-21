# ui

見た目を担う純粋なUIコンポーネント群。機能を持つコンポーネントは `/features` に置く。

## ファイル構成

```
ComponentName/
  index.tsx          # 見た目・アクセシビリティ・props設計に特化した再利用可能なUI
  index.module.css   # スタイル定義
  index.stories.tsx  # 各propsパターンの確認
  index.test.tsx     # ユニットテスト（TDD）
```

## テスト方針

TDDで開発する。「テストを書く → 実装する → リファクタする」のサイクルを繰り返す。

- **Storybook**：ビジュアルリグレッション・インタラクション・アクセシビリティテスト
- **Vitest**：期待するHTMLタグ・属性・DOMロールのユニットテスト
