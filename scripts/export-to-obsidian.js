import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { findImageRefs, resolvePaths } from "./lib/obsidian.js";

const paths = resolvePaths();

/** ファイル名として安全な文字列にする（パス区切り等を除去）。 */
const safeFileName = ({ name }) => name.replace(/[/\\:*?"<>|]/g, "-").trim();

const listDirs = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
};

// ブログ / スクラップとも「フォルダ + index.md + 同居画像」の同じ構造なので、
// 変換元フォルダ (sourceRoot) と出力先 (vaultDir) を差し替えるだけで共通化できる。
const exportEntry = async ({ folder, sourceRoot, vaultDir, usedNames }) => {
  const entryDir = path.join(sourceRoot, folder);
  const raw = await fs.readFile(path.join(entryDir, "index.md"), "utf-8");
  const { data, content } = matter(raw);

  // 共有 attachments フォルダは vault 全体で名前が一意である必要があるため、
  // 別記事と同名の画像はフォルダ名を接頭辞に付けて衝突を避ける。
  const files = await fs.readdir(entryDir);
  const renamed = new Map();
  let copiedImages = 0;
  for (const file of files) {
    if (file === "index.md") continue;
    const attachmentName = usedNames.has(file) ? `${folder}-${file}` : file;
    usedNames.add(attachmentName);
    renamed.set(file, attachmentName);
    await fs.copyFile(
      path.join(entryDir, file),
      path.join(paths.vaultAttachments, attachmentName),
    );
    copiedImages += 1;
  }

  let body = content;
  for (const ref of findImageRefs({ body })) {
    const name = renamed.get(ref.fileName) ?? ref.fileName;
    const inner = ref.alt ? `${name}|${ref.alt}` : name;
    body = body.split(ref.raw).join(`![[${inner}]]`);
  }

  const noteName = safeFileName({ name: data.title || folder });
  const output = matter.stringify(body, { ...data, slug: folder });
  await fs.writeFile(path.join(vaultDir, `${noteName}.md`), output);
  return { noteName, copiedImages };
};

const main = async () => {
  console.log(`📂 Vault: ${paths.vaultRoot}`);
  await fs.mkdir(paths.vaultBlog, { recursive: true });
  await fs.mkdir(paths.vaultScraps, { recursive: true });
  await fs.mkdir(paths.vaultAttachments, { recursive: true });

  const usedNames = new Set();

  let posts = 0;
  let images = 0;
  for (const folder of await listDirs(paths.repoPosts)) {
    const res = await exportEntry({
      folder,
      sourceRoot: paths.repoPosts,
      vaultDir: paths.vaultBlog,
      usedNames,
    });
    posts += 1;
    images += res.copiedImages;
    console.log(`✅ blog/${res.noteName}.md (画像 ${res.copiedImages} 件)`);
  }

  let scraps = 0;
  for (const folder of await listDirs(paths.repoScraps)) {
    const res = await exportEntry({
      folder,
      sourceRoot: paths.repoScraps,
      vaultDir: paths.vaultScraps,
      usedNames,
    });
    scraps += 1;
    images += res.copiedImages;
    console.log(`✅ scraps/${res.noteName}.md (画像 ${res.copiedImages} 件)`);
  }

  console.log(
    `\n🎉 移行完了: 記事 ${posts} 件 / 画像 ${images} 件 / スクラップ ${scraps} 件`,
  );
  console.log(
    "ℹ️  リポジトリ側の元ファイルは削除していません。確認後に手動で判断してください。",
  );
};

main().catch((error) => {
  console.error("❌ 移行失敗:", error);
  process.exit(1);
});
