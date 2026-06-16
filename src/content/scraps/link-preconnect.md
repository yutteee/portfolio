---
title: 'link rel="preconnect"'
pubDate: "2026-05-17"
description: 'preconnect キーワードを rel 属性に指定すると、 <link> 要素はブラウザにそのオリジンへの接続を事前に開始することを命令することで、処理を高速化できる。'
---

## 詳細

google fontを使用する際、以下のように記述をする。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic&display=swap" rel="stylesheet">
```

ここで、`rel="preconnect"`はリンクとサーバとの接続を確立する処理を事前に行うことで高速化をする設定である。


> <link> に rel=preconnect を追加すると、ページが別のドメインへの接続を確立する予定であり、そのプロセスをできるだけ早く開始することをブラウザに通知します。ブラウザがリソースをリクエストする時点で設定プロセスが完了しているため、リソースの読み込みが速くなります。

`googleapis`と`gstatic`の2つを preconnect することによって、これら二つの connecting が並列で行われるため逐次的に処理するのと比べて高速化できる。

## ユースケース

- フェッチする内容は不明だが、どこからフェッチするかはわかる
  - 特定のCDNからリクエストすることがわかっても、正確なパスがわからない場合がある
- 画像CDNから画像を読み込む場合
  - ユーザーのメディアクエリまたはランタイム機能チェックによって画像の正確なパスが変わる

## 参考

- [ネットワーク接続を早期に確立して、認識されるページ速度を改善する](https://web.dev/articles/preconnect-and-dns-prefetch?hl=ja)
- [rel="preconnect"](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Attributes/rel/preconnect)