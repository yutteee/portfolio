import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/posts');
const PUBLIC_DIR = path.join(__dirname, '../public/posts');

async function copyImages() {
  try {
    // public/postsディレクトリが存在しない場合は作成
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // src/content/posts内のディレクトリを取得
    const postDirs = await fs.readdir(CONTENT_DIR);
    
    for (const dir of postDirs) {
      const postDirPath = path.join(CONTENT_DIR, dir);
      const stat = await fs.stat(postDirPath);
      
      if (stat.isDirectory()) {
        const publicPostDir = path.join(PUBLIC_DIR, dir);
        
        // public/posts/[post-dir]ディレクトリを作成
        await fs.mkdir(publicPostDir, { recursive: true });
        
        // ディレクトリ内のファイルを取得
        const files = await fs.readdir(postDirPath);
        
        for (const file of files) {
          // index.md以外のファイル（画像ファイル）をコピー
          if (file !== 'index.md') {
            const sourcePath = path.join(postDirPath, file);
            const destPath = path.join(publicPostDir, file);
            
            // ファイルの存在確認
            try {
              await fs.access(sourcePath);
              await fs.copyFile(sourcePath, destPath);
              console.log(`✅ Copied: ${sourcePath} → ${destPath}`);
            } catch (error) {
              console.error(`❌ Failed to copy ${sourcePath}:`, error.message);
            }
          }
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