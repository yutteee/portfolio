アニメーションの再生 / 停止を切り替えるトグルボタンです。

- 停止ボタンと再生ボタンの両方を常に DOM に置き、`<html>` の `.stop` クラスの有無で CSS が片方を `display: none` する設計です。
- これにより SSR 出力と最終状態が一致し、ハイドレーション時のちらつき（FOUC）が発生しません。
- クリック時は `<html>` 要素の `.stop` クラスをトグルし、`localStorage` の `animation` キーに永続化します。

- 初期状態（`localStorage` / `prefers-reduced-motion`）の解決は `BaseLayout` のインラインスクリプトが担います。

このポートフォリオ固有のコンポーネントです。
