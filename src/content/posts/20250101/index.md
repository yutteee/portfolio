---
title: 'Reactコンポーネント設計のベストプラクティス'
pubDate: "2025-01-01"
description: 'Reactコンポーネントの設計について解説します'
type: 'slide'
theme: 'default'
---

# Reactコンポーネント設計のベストプラクティス

中村優作

---

## 目次

1. コンポーネントの責務分離
2. Props設計の原則
3. 状態管理の考え方
4. パフォーマンス最適化

---

## 1. コンポーネントの責務分離

### Presentational Component
- 見た目のみを担当
- ビジネスロジックを持たない
- 再利用可能

### Container Component
- データ取得と状態管理
- ビジネスロジック
- Presentational Componentにデータを渡す

---

## 2. Props設計の原則

```typescript
// 良い例
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

// 悪い例
interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}
```

---

## 3. 状態管理の考え方

### 状態の種類
- **Local State**: コンポーネント内でのみ使用
- **Shared State**: 複数コンポーネントで共有
- **Server State**: APIから取得するデータ

### 状態管理ライブラリの選択
- useState: ローカル状態
- Context API: 中規模アプリ
- Redux/Zustand: 大規模アプリ

---

## 4. パフォーマンス最適化

### React.memo
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* 重い処理 */}</div>;
});
```

### useMemo / useCallback
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## まとめ

1. **責務を明確に分離**する
2. **型安全なProps設計**を行う
3. **適切な状態管理**を選択する
4. **パフォーマンス**を意識する

### 参考資料
- React公式ドキュメント
- React Design Patterns
- 実践的なReact開発

---

# ありがとうございました！

質問があればお気軽にどうぞ 