FROM node:24.12.0-bookworm-slim

# 開発環境であることを明示
ENV NODE_ENV=development

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@10.27 --activate

# 開発に必要なツールをインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# 非rootユーザーで実行
USER node

# 作業ディレクトリを設定
WORKDIR /workspace







