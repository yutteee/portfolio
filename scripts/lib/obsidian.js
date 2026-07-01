import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.join(__dirname, "../..");

const DEFAULT_VAULT = path.join(
  os.homedir(),
  "Library/Mobile Documents/iCloud~md~obsidian/Documents/ObsidianVault",
);

/**
 * リポジトリ側 / Obsidian vault 側のパスをまとめて解決する。
 * vault は環境変数 OBSIDIAN_VAULT で上書きできる。
 */
export const resolvePaths = () => {
  const vaultRoot = process.env.OBSIDIAN_VAULT
    ? path.resolve(process.env.OBSIDIAN_VAULT)
    : DEFAULT_VAULT;

  return {
    vaultRoot,
    vaultBlog: path.join(vaultRoot, "blog"),
    vaultScraps: path.join(vaultRoot, "scraps"),
    vaultAttachments: path.join(vaultRoot, "attachments"),
    repoPosts: path.join(REPO_ROOT, "src/content/posts"),
    repoScraps: path.join(REPO_ROOT, "src/content/scraps"),
  };
};

/** "2024-07-29" → "20240729"。日付として不正なら null。 */
export const dateToFolder = ({ pubDate }) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(pubDate ?? ""));
  return match ? `${match[1]}${match[2]}${match[3]}` : null;
};

/**
 * 画像ファイル名を Markdown / URL で安全な形に整える。
 * Obsidian の貼り付け画像名（"Pasted image 20260701.png" 等）は空白を含み、
 * 標準 Markdown の `![](path)` では空白で URL が途切れてしまうため置換する。
 */
export const sanitizeImageName = ({ fileName }) => {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  return `${base.trim().replace(/\s+/g, "-")}${ext}`;
};

/**
 * Markdown 本文から画像参照を抽出する。
 * - Obsidian 埋め込み: ![[name.png]] / ![[name.png|alt]]
 * - 標準 Markdown:     ![alt](path/name.png)
 * 画像拡張子のみ対象（ノート同士の埋め込みは除外）。
 */
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i;

export const findImageRefs = ({ body }) => {
  const refs = [];

  const wikilink = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;
  for (const m of body.matchAll(wikilink)) {
    const target = m[1].trim();
    if (!IMAGE_EXT.test(target)) continue;
    refs.push({
      raw: m[0],
      fileName: path.basename(target),
      alt: (m[2] ?? "").trim(),
      kind: "wikilink",
    });
  }

  const markdown = /!\[([^\]]*)\]\(([^)]+)\)/g;
  for (const m of body.matchAll(markdown)) {
    const target = m[2].trim();
    if (!IMAGE_EXT.test(target)) continue;
    if (/^https?:\/\//.test(target)) continue;
    refs.push({
      raw: m[0],
      fileName: path.basename(target),
      alt: m[1].trim(),
      kind: "markdown",
    });
  }

  return refs;
};
