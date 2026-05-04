---
title: 'Claude Code 主軸の開発に合わせて Dev Container をカスタマイズする'
pubDate: "2026-05-04"
description: 'Shai-Hulud 2.0 攻撃を受けての対策として導入した Dev Container を、devcontainer CLI と git worktree で運用するためにカスタマイズしました。ベースイメージ・dcup 関数・worktree 対応など、現時点の構成をまとめます。'
---

## はじめに

以前、[Shai-Hulud 2.0 攻撃を受けての反省と対策](https://yutteee.pages.dev/posts/20251227/)という記事を書きました。このブログの中で、 Dev Container を導入して PC から開発環境を分離することで、万が一攻撃を受けても被害をコンテナ内に閉じ込められるようにする、というセキュリティ対策を紹介しました。

しばらく Dev Container を運用していく中でいくつか課題が出てきたため、自分のスタイルに沿うように設定をカスタマイズしました。運用も固まってきたので、現時点の構成をブログにまとめます。

## devcontainer CLI で開発をターミナルで完結させる

もともと Cursor をメインのエディタとして使っていたのですが、最近は Claude Code を主軸に開発するスタイルに変わりました。Cursor を経由する必然性は薄れていて、Dev Container を使うためだけに Cursor を立ち上げて、その中で Claude Code にログインする、というワンクッション挟まる運用になっていました。

Claude Code を使うのであれば、できるだけターミナルから出たくありません。そこで採用したのが [devcontainer CLI](https://github.com/devcontainers/cli) です。VSCode や Cursor を経由せずに、ターミナルから直接 Dev Container を立ち上げて、コンテナの中で Claude Code を動かす運用に切り替えました。

`~/.claude`（Claude Code の認証・履歴・設定）はホストとコンテナで共有したいので、コンテナ起動時に bind mount します。これで、コンテナ内で `claude` を起動してもホストと同じセッションがそのまま使えて、毎回ログインし直す必要がありません。

これによってセキュアな開発をターミナルで完結できるようになりました。

## 共通設定とプロジェクト固有設定を分ける

`~/dev/.devcontainer-base` に共通のベースイメージ定義（`claude-dev:latest`）を置いて、各プロジェクトはそれを参照するだけにしています。Claude Code CLI、Node.js LTS、GitHub CLI といった、どのプロジェクトでも使うものはベースイメージ側に集約しました。

```jsonc
// ~/dev/.devcontainer-base
{
  "name": "claude-dev-base",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu-24.04",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "lts" },
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/anthropics/devcontainer-features/claude-code:latest": {}
  },
  "remoteUser": "vscode"
}
```

これを `devcontainer build --image-name claude-dev:latest` でローカルに焼いておけば、各プロジェクトの `devcontainer.json` から `"image": "claude-dev:latest"` で参照できます。features を増やしたくなったらこのファイルを編集してビルドし直すだけで、すべてのプロジェクトに反映されます。

各プロジェクトの `devcontainer.json` には、そのプロジェクト固有の事情だけを書きます。

```jsonc
// このリポジトリ(portfolio)の devcontainer.json
{
  "name": "portfolio",
  "image": "claude-dev:latest",
  "remoteUser": "vscode",
  "workspaceFolder": "/workspace",
  "mounts": [
    "source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=cached"
  ],
  "forwardPorts": [4321, 6006],
  "postCreateCommand": "npm install -g pnpm@10.27 && pnpm install"
}
```

自分の個人環境に紐づく設定（`~/.claude` や `~/.gitconfig` のマウント）はプロジェクト側には書きません。リポジトリを公開したときにホストのパスが漏れますし、他人が同じリポジトリを使うときにも邪魔になります。

これらは `dcup` というシェル関数（`devcontainer up`のラッパー）が、コンテナ起動時に `--mount` で注入する形にしました。これで、コンテナ内で `claude` を起動してもホストと同じセッションがそのまま使えます。

```sh
cd <project>
dcup       # コンテナを立ち上げる（個人共通マウントを --mount で注入）
```

## git worktree でも動くようにする

AI の発展に伴い、Agent を並列で動かしながら開発するスタイルが定着してきました。私も `git worktree` で機能ごとに作業ツリーを切って、それぞれ独立した Agent を走らせる運用をしています。

ただ、worktree で切った作業ツリーで Dev Container を立ち上げると、そのままではコンテナ内で git が使えません。理由は、worktree 内の `.git` がディレクトリではなくファイルになっていて、中身は次のような参照だけが書かれているためです。

```
gitdir: /Users/yutteee/dev/<project>/.git/worktrees/<name>
```

bind mount したのは worktree のディレクトリだけなので、参照先の `.git` 本体（メインリポジトリ側）はコンテナ内に存在しません。その結果、コンテナ内で `git status` を打つと `fatal: not a git repository` で落ちます。

これを解決するために、`dcup` 関数の冒頭にこの分岐を入れています。

```sh
if [ -f .git ] && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  local common_dir
  common_dir=$(realpath "$(git rev-parse --git-common-dir)")
  extra_mounts+=("--mount" "type=bind,source=${common_dir},target=${common_dir}")
fi
```

カレントディレクトリが worktree（`.git` がファイル）なら、メインリポジトリの共通 `.git` ディレクトリをホストと同じ絶対パスでコンテナ内にもバインドマウントします。`.git` ファイルの中の `gitdir:` がホストの絶対パスを指しているので、その同じパスがコンテナ内にも存在する状態を作ってしまえば、参照がそのまま解決できます。

## まとめ

- エディタをいちいち開くのをやめて、ターミナル + devcontainer CLI + Claude Code でコードを書く運用に切り替えた
- 共通のベースイメージとプロジェクト固有の設定をきれいに分離し、個人環境に紐づくマウントは `dcup` 関数側に逃がした
- worktree 対応は `dcup` 側で `.git` 共通ディレクトリを同じ絶対パスにマウントする形でケアした

しばらくこの構成で回してみて、不便なところが出てきたら都度調整していこうと思います。