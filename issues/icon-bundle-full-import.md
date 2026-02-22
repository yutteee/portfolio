# react-icons をフルインポートしている

## 現状の問題

`src/ui/IconButton/index.tsx` で `react-icons/fi` の全アイコンを `* as FiIcons` でインポートし、文字列キーで動的アクセスしている。

```tsx
// src/ui/IconButton/index.tsx
import * as FiIcons from "react-icons/fi";  // 全アイコンをインポート

const IconComponent = FiIcons[icon];  // 文字列キーで動的アクセス
```

`icon` props は `keyof typeof FiIcons` 型になっており、型安全ではあるが実装が間接的。

### 何が問題か

- `import * as FiIcons` はモジュール全体を参照するため、バンドラーの tree shaking が効きにくい
- `icon` 名を文字列で渡す API は、アイコン変更時にリファクタリングツール（IDEの参照検索など）が追跡しにくい
- 実際に使用しているアイコンは数個だが、全アイコンが参照対象になる

## 理想の状態

アイコンコンポーネント自体を props で受け取り、個別インポートを促す設計にする。

```tsx
// src/ui/IconButton/index.tsx
import type { IconType } from "react-icons";

type IconButtonProps = {
  label: string;
  icon: IconType;  // コンポーネントを直接受け取る
  ...
};

// 使用側
import { FiMenu } from "react-icons/fi";  // 個別インポート

<IconButton label="メニューを開く" icon={FiMenu} ... />
```

これにより各アイコンが個別インポートとなり、tree shaking が確実に機能する。

## 移行スコープ

- `IconButton` の `icon` props を `keyof typeof FiIcons`（文字列）から `IconType`（コンポーネント）に変更
- `import * as FiIcons from "react-icons/fi"` を削除
- 呼び出し元すべてで `icon={FiMenu}` のように個別インポートに変更
