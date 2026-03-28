#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Set git author identity (synchronous - must complete before session starts)
git config user.name "yutteee"

# Install dependencies in background
echo '{"async": true, "asyncTimeout": 300000}'

pnpm install
