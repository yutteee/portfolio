---
title: 'フロントエンドのセキュアなdev-container環境を作る'
pubDate: "2026-01-04"
description: 'Shai-Hulud 2.0 攻撃'
---

### 1. dev containerの導入

dev containerだとpathが解決できない
https://qiita.com/suzuki_sh/items/2fc7788aa2b025741819


dockerがよくわからん
---

どう選ぶかのブログ
https://tech.iimon.co.jp/entry/2025/12/17

node.jsの公式docker imageを使えばnodeをインストールしたり依存関係を設定しなくていい
普通はこれ使えばよさそう

debian(bookworm)とかこの辺の種類がよくわからん
多分linuxとかのos周り的な低レイヤーの話

イメージのサイズ的に何を使うかを考えた方がいい
依存関係が少ない方がいいのでどうするか検討した方が良さそう

まずは、node:<version>-slim を検討する
イメージサイズが最優先の場合はnode:<version>-alpine
開発、ビルド環境であればnode:<version>

---

docker imageはどこから探せばいいのか


まぁこれか
https://hub.docker.com/_/node


---


先にこれをみた方が良さそう
https://snyk.io/jp/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/?_gl=1*1qmgjnd*_gcl_au*MjA0MTQ5MjQ5MS4xNzY3NDM4MDg0*_ga*MTY5MjUzNjQ1NC4xNzY3NDM4MDg0*_ga_X9SH3KP7B4*czE3Njc0MzgwODIkbzEkZzEkdDE3Njc0MzgwOTAkajUyJGwwJGgw

- version指定しようね
- 軽量なやつ使おうね

debian's slimが最適
- ダメなpractice：alpine
  - Node.js Docker チームが管理する非公式な Docker コンテナイメージのビルド
  - セキュリティ脆弱性スキャナーではいろいろ検出できない

本番環境向けに最適化しよう
- NODE_ENV productionにする
- 本番環境に最適化された設定が有効になる
- 開発環境との違いが出ることは頭に入れといてね、

コンテナをrootで指定するな
- コマンドインジェクションやディレクトリトラバーサルできる
- rootの場合、コンテナのエスケープ試行とかなんでもできる

dockerアプリケーションを安全に終了する
- 強制終了すると書き込み中のデータが壊れたりしちゃうよ
- コンテナのプロセスにシグナルを送信する方法が必要
  - SIGTERMやSIGKILLなど
- `CMD`ディレクティブ
  - コンテナが起動した瞬間に、コンテナの中で実行するデフォルトのコマンド


脆弱性を検出して修正する
- snykってポジショントークじゃね
- 他に診断するツール人気なのありそうだよなぁ...

debianの最新のソフトウェアを使って独自のベースイメージを管理したっていい


個人ならtrivyで良さそう
https://trivy.dev/docs/latest/getting-started/



マルチステージビルドを使いましょう
- ビルドステップの分離
- 機密情報の漏洩を防ぐことができる
- コンテナイメージのシークレット管理
　　- これクレデンシャルの秘匿でもいけそうだなぁ
- nodeの場合
  - npmパッケージのインストール、npmモジュールのコンパイル
  - dockerビルド


dockerignoreを適切に使いましょう

シークレットを適切に使いましょう

---


最適なnodejs docker imageを選択する

https://snyk.io/jp/blog/choosing-the-best-node-js-docker-image/







やったこと

どのnode docker imageを使う？
- 安定版
- 軽量のslimのもの
    - 依存関係が少なく、セキュリティリスクが低い
    - ビルドが早い
- バージョンを明示的に指定
    - 勝手にアップデートされない

非rootユーザーで実行

