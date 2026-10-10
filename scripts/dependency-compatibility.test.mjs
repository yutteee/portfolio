import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const withDirectory = async ({ run }) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'portfolio-dependency-test-'));
  try {
    await run({ directory });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
};

test('Astro checkのChokidarがファイルの追加を検出する', { timeout: 10000 }, async () => {
  const checkRequire = createRequire(import.meta.resolve('@astrojs/check'));
  const { watch } = checkRequire('chokidar');
  await withDirectory({
    run: async ({ directory }) => {
      const watcher = watch(directory, { ignoreInitial: true });
      try {
        await once(watcher, 'ready', { signal: AbortSignal.timeout(5000) });
        const added = once(watcher, 'add', { signal: AbortSignal.timeout(5000) });
        const filename = path.join(directory, 'component.astro');
        await writeFile(filename, '<p>Hello</p>');
        assert.equal((await added)[0], filename);
      } finally {
        await watcher.close();
      }
    },
  });
});

test('React integrationのBabelがバージョン要件を検査してコードを変換する', () => {
  const reactRequire = createRequire(import.meta.resolve('@astrojs/react'));
  const pluginRequire = createRequire(reactRequire.resolve('@vitejs/plugin-react'));
  const { transformSync } = pluginRequire('@babel/core');
  const result = transformSync('const before = 1;', {
    babelrc: false,
    configFile: false,
    plugins: [api => {
      api.assertVersion('^7.0.0');
      return {
        visitor: {
          Identifier: nodePath => {
            if (nodePath.node.name === 'before') nodePath.node.name = 'after';
          },
        },
      };
    }],
  });
  assert.match(result.code, /const after = 1/);
});

test('Marpが更新したKaTeXとXMLパーサーで数式を描画する', () => {
  const marpRequire = createRequire(import.meta.resolve('@marp-team/marp-core'));
  const { Marp } = marpRequire('@marp-team/marp-core');
  for (const math of ['katex', 'mathjax']) {
    const { html } = new Marp({ math }).render('# Formula\n\n$E=mc^2$');
    assert.match(html, math === 'katex' ? /class="katex"/ : /mjx-container/);
  }
});
