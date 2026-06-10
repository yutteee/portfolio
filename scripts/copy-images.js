import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SLIDE_IMAGE_PUBLIC_DIR } from '../src/utils/slidePostImage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/posts');
const PUBLIC_DIR = path.join(__dirname, `../public/${SLIDE_IMAGE_PUBLIC_DIR}`);

// frontmatter に `marp: true` を持つ記事だけをスライドとみなす。
// ブログ記事の画像は Astro のコンテンツコレクションが解決するためコピー不要。
async function isSlidePost(indexMdPath) {
  let content;
  try {
    content = await fs.readFile(indexMdPath, 'utf-8');
  } catch {
    // index.md が無いディレクトリはスライドではない
    return false;
  }

  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return false;
  }

  return /^\s*marp\s*:\s*true\s*$/m.test(frontmatterMatch[1]);
}

async function copyImages() {
  try {
    // 古いコピー結果（ブログ画像などの残骸）を一掃してから作り直す
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    const postDirs = await fs.readdir(CONTENT_DIR);

    for (const dir of postDirs) {
      const postDirPath = path.join(CONTENT_DIR, dir);
      const stat = await fs.stat(postDirPath);

      if (!stat.isDirectory()) {
        continue;
      }

      // スライド記事のみ画像をコピーする
      if (!(await isSlidePost(path.join(postDirPath, 'index.md')))) {
        console.log(`⏭️  Skipped (not a slide): ${dir}`);
        continue;
      }

      const publicPostDir = path.join(PUBLIC_DIR, dir);
      await fs.mkdir(publicPostDir, { recursive: true });

      const files = await fs.readdir(postDirPath);

      for (const file of files) {
        // index.md 以外のファイル（画像ファイル）をコピー
        if (file === 'index.md') {
          continue;
        }

        const sourcePath = path.join(postDirPath, file);
        const destPath = path.join(publicPostDir, file);

        try {
          await fs.copyFile(sourcePath, destPath);
          console.log(`✅ Copied: ${sourcePath} → ${destPath}`);
        } catch (error) {
          console.error(`❌ Failed to copy ${sourcePath}:`, error.message);
        }
      }
    }

    console.log('🎉 Image copy completed successfully!');
  } catch (error) {
    console.error('❌ Error copying images:', error);
    process.exit(1);
  }
}

copyImages();
