AnimationIconをReactアイランド化

## 概要

`AnimationIcon` を Astro コンポーネントから React アイランドへ移行し、Container/Presenter 分割を解消して 1 ファイルに統合した。状態管理は `useAnimationMode` フックに切り出し、テスト・Story を拡充している。
副作用として、テーマ切り替えと同様にアニメーション設定の FOUC を防ぐためのブロッキングスクリプトを `BaseLayout.astro` に追加した。

## 変更内容

- `src/pages/_components/AnimationIcon.astro` を削除し、`src/features/AnimationIcon` の React コンポーネントに統合
- `TopAnimation.astro` から `client:load` で React アイランドとして読み込むように変更
- `presenter.tsx` / `index.module.css` を削除し、`index.tsx` に統合（Container/Presenter 分割の解消）
- `src/features/AnimationIcon/hooks/useAnimationMode.ts` を新設し、localStorage / `prefers-reduced-motion` を考慮した初期値ロジックと、`<html>.stop` クラス・localStorage 同期を集約
- `BaseLayout.astro` に DOM 表示前に `.stop` クラスを付与するインラインスクリプトを追加（アニメーション設定の FOUC 対策）
- `TopAnimation.astro` で旧来のクリックリスナー連携をやめ、`MutationObserver` で `<html>` の `.stop` クラス変化を監視して GSAP の有効/無効を切り替え
- `index.test.tsx` を `userEvent` ベースに刷新し、初期表示（localStorage / `prefers-reduced-motion` の各分岐）と操作（停止 / 再生切り替え）の振る舞いをカバー
- `index.stories.tsx` に再生・停止状態の Story と `play` 関数によるトグルのインタラクションテストを追加

## 関連コミット

- `AnimationIconをReactアイランド化`

## 確認事項

- [ ] ローカルで動作確認済み
- [ ] `pnpm run check` (Biome) がパスする
- [ ] `pnpm run test:unit` がパスする

## スクリーンショット（UI変更がある場合）

見た目の変更はなく、内部実装のみのリファクタリングのため省略。
