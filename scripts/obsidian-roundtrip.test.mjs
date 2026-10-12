import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parseFrontmatter } from './lib/frontmatter.js';

const execute = promisify(execFile);
const repo = fileURLToPath(new URL('../', import.meta.url));

test('Obsidianの記事とスクラップを画像・日付・本文を保って往復できる', { timeout: 15000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'portfolio-obsidian-test-'));
  const fixtureRepo = path.join(directory, 'repo');
  const vault = path.join(directory, 'vault');
  try {
    for (const subdirectory of ['blog', 'scraps', 'attachments']) {
      await mkdir(path.join(vault, subdirectory), { recursive: true });
    }
    for (const kind of ['posts', 'scraps']) {
      await mkdir(path.join(fixtureRepo, 'src/content', kind), { recursive: true });
    }
    await cp(path.join(repo, 'scripts'), path.join(fixtureRepo, 'scripts'), { recursive: true });
    await symlink(path.join(repo, 'node_modules'), path.join(fixtureRepo, 'node_modules'), 'dir');
    await writeFile(path.join(fixtureRepo, 'package.json'), '{"type":"module"}');
    const image = Buffer.from('fixture image');
    await writeFile(path.join(vault, 'attachments', 'Cover image.png'), image);
    await writeFile(path.join(vault, 'blog', 'note.md'), [
      '---',
      'title: "記事: YAMLの更新"',
      'pubDate: 2026-10-01',
      'description: >-',
      '  一行目の説明を',
      '  二行目へ続ける。',
      'slug: yaml-update',
      'draft: false',
      '---',
      '# 本文',
      '',
      '![[Cover image.png|写真の説明]]',
      '',
    ].join('\n'));
    await writeFile(path.join(vault, 'blog', 'draft.md'), '---\ntitle: 下書き\ndraft: true\n---\n未公開\n');
    await writeFile(path.join(vault, 'scraps', 'memo.md'), '---\ntitle: メモ\npubDate: "2026-10-02"\ndescription: 短い説明\n---\nメモ本文\n');

    const run = async ({ script }) => execute(process.execPath, [path.join(fixtureRepo, 'scripts', script)], {
      cwd: fixtureRepo,
      env: { ...process.env, OBSIDIAN_VAULT: vault },
    });
    await run({ script: 'import-from-obsidian.js' });
    assert.deepEqual(await readdir(path.join(fixtureRepo, 'src/content/posts')), ['yaml-update']);
    const post = path.join(fixtureRepo, 'src/content/posts/yaml-update/index.md');
    const imported = await readFile(post, 'utf8');
    const { data, content } = parseFrontmatter({ raw: imported });
    assert.deepEqual(data, {
      title: '記事: YAMLの更新',
      pubDate: '2026-10-01',
      description: '一行目の説明を 二行目へ続ける。',
    });
    assert.equal(content, '# 本文\n\n![写真の説明](./Cover-image.png)\n');
    assert.deepEqual(await readFile(path.join(path.dirname(post), 'Cover-image.png')), image);
    const scrap = path.join(fixtureRepo, 'src/content/scraps/memo/index.md');
    assert.equal(parseFrontmatter({ raw: await readFile(scrap, 'utf8') }).content, 'メモ本文\n');

    await run({ script: 'export-to-obsidian.js' });
    const exported = parseFrontmatter({ raw: await readFile(path.join(vault, 'blog', '記事- YAMLの更新.md'), 'utf8') });
    assert.deepEqual(exported.data, { ...data, slug: 'yaml-update' });
    assert.equal(exported.content, '# 本文\n\n![[Cover-image.png|写真の説明]]\n');
    await rm(path.join(vault, 'blog', 'note.md'));
    await run({ script: 'import-from-obsidian.js' });
    assert.equal(await readFile(post, 'utf8'), imported);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
