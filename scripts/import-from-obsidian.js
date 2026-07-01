import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  dateToFolder,
  findImageRefs,
  resolvePaths,
  sanitizeImageName,
} from "./lib/obsidian.js";

const paths = resolvePaths();

const warnings = [];
const warn = (message) => warnings.push(message);

/** ディレクトリを再帰的に走査して { ファイル名(小文字) → 絶対パス } を作る。 */
const indexFilesByName = async (dir) => {
  const map = new Map();
  const walk = async (current) => {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (!map.has(entry.name.toLowerCase())) {
        map.set(entry.name.toLowerCase(), full);
      }
    }
  };
  await walk(dir);
  return map;
};

const readMarkdownFiles = async (dir) => {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => path.join(dir, e.name));
};

const requireFields = ({ data, source, fields }) => {
  const missing = fields.filter((f) => !data[f]);
  if (missing.length > 0) {
    warn(`⚠️  ${source}: 必須フィールド不足 (${missing.join(", ")}) → スキップ`);
    return false;
  }
  return true;
};

const buildPostFrontmatter = ({ data }) => {
  const fm = {
    title: data.title,
    pubDate: data.pubDate,
    description: data.description,
  };
  if (data.image) fm.image = data.image;
  if (data.type) fm.type = data.type;
  if (data.marp) fm.marp = data.marp;
  if (data.theme) fm.theme = data.theme;
  return fm;
};

const buildScrapFrontmatter = ({ data }) => ({
  title: data.title,
  pubDate: data.pubDate,
  description: data.description,
});

// ブログ / スクラップの違いだけを設定として持ち、変換処理は共通化する。
const KINDS = {
  post: {
    root: () => paths.repoPosts,
    folderOf: ({ data }) =>
      data.slug || dateToFolder({ pubDate: data.pubDate }),
    isMarp: ({ data }) => data.marp === true,
    frontmatter: buildPostFrontmatter,
  },
  scrap: {
    root: () => paths.repoScraps,
    folderOf: ({ data, file }) => data.slug || path.basename(file, ".md"),
    isMarp: () => false,
    frontmatter: buildScrapFrontmatter,
  },
};

const importEntry = async ({ file, kind, attachmentsIndex, vaultIndex }) => {
  const config = KINDS[kind];
  const raw = await fs.readFile(file, "utf-8");
  const { data, content } = matter(raw);
  const source = path.relative(paths.vaultRoot, file);

  if (data.draft === true) return { skipped: true };
  if (
    !requireFields({
      data,
      source,
      fields: ["title", "pubDate", "description"],
    })
  ) {
    return { skipped: true };
  }

  const folder = config.folderOf({ data, file });
  if (!folder) {
    warn(
      `⚠️  ${source}: フォルダ名を決定できません（slug/pubDate を確認） → スキップ`,
    );
    return { skipped: true };
  }

  const targetDir = path.join(config.root(), folder);
  await fs.mkdir(targetDir, { recursive: true });

  const isMarp = config.isMarp({ data });
  let body = content;
  let copiedImages = 0;

  const seen = new Set();
  for (const ref of findImageRefs({ body })) {
    const src =
      attachmentsIndex.get(ref.fileName.toLowerCase()) ??
      vaultIndex.get(ref.fileName.toLowerCase());
    if (!src) {
      warn(`⚠️  ${source}: 画像が見つかりません (${ref.fileName})`);
      continue;
    }

    const destName = sanitizeImageName({ fileName: ref.fileName });
    if (!seen.has(destName)) {
      await fs.copyFile(src, path.join(targetDir, destName));
      seen.add(destName);
      copiedImages += 1;
    }

    if (!ref.alt) {
      warn(`⚠️  ${source}: alt 未設定の画像 (${ref.fileName})`);
    }

    const link = isMarp ? destName : `./${destName}`;
    body = body.split(ref.raw).join(`![${ref.alt}](${link})`);
  }

  const output = matter.stringify(body, config.frontmatter({ data }));
  await fs.writeFile(path.join(targetDir, "index.md"), output);
  return { slug: folder, copiedImages };
};

const main = async () => {
  console.log(`📂 Vault: ${paths.vaultRoot}`);

  const attachmentsIndex = await indexFilesByName(paths.vaultAttachments);
  const vaultIndex = await indexFilesByName(paths.vaultRoot);

  const postFiles = await readMarkdownFiles(paths.vaultBlog);
  const scrapFiles = await readMarkdownFiles(paths.vaultScraps);

  let posts = 0;
  let images = 0;
  for (const file of postFiles) {
    const res = await importEntry({
      file,
      kind: "post",
      attachmentsIndex,
      vaultIndex,
    });
    if (res.skipped) continue;
    posts += 1;
    images += res.copiedImages;
    console.log(`✅ posts/${res.slug} (画像 ${res.copiedImages} 件)`);
  }

  let scraps = 0;
  for (const file of scrapFiles) {
    const res = await importEntry({
      file,
      kind: "scrap",
      attachmentsIndex,
      vaultIndex,
    });
    if (res.skipped) continue;
    scraps += 1;
    images += res.copiedImages;
    console.log(`✅ scraps/${res.slug} (画像 ${res.copiedImages} 件)`);
  }

  console.log(
    `\n🎉 インポート完了: 記事 ${posts} 件 / 画像 ${images} 件 / スクラップ ${scraps} 件`,
  );

  if (warnings.length > 0) {
    console.log(`\n⚠️  警告 ${warnings.length} 件:`);
    for (const w of warnings) console.log(`  ${w}`);
  }
};

main().catch((error) => {
  console.error("❌ インポート失敗:", error);
  process.exit(1);
});
