import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { createElement } from 'react';
import satori from 'satori';

const require = createRequire(import.meta.url);
const satoriEntry = require.resolve('satori');
const { strFromU8, strToU8, unzipSync, zipSync } = createRequire(satoriEntry)('fflate');

test('SatoriのZIP依存は日本語のファイル名と本文を保って往復できる', () => {
  const archive = zipSync({ '記事.txt': strToU8('日本語と記号: <>&"') });
  assert.equal(strFromU8(unzipSync(archive)['記事.txt']), '日本語と記号: <>&"');
});

test('ZIP64拡張が欠けたZIPを無限ループせず拒否する', () => {
  const archive = Buffer.from(zipSync({ 'note.txt': strToU8('hello') }));
  const endOffset = archive.length - 22;
  const centralOffset = archive.readUInt32LE(endOffset + 16);
  archive.writeUInt32LE(0xffffffff, centralOffset + 20);

  const zip64End = Buffer.alloc(56);
  zip64End.writeUInt32LE(0x06064b50);
  zip64End.writeUInt32LE(44, 4);
  zip64End.writeUInt32LE(1, 32);
  zip64End.writeUInt32LE(centralOffset, 48);
  const locator = Buffer.alloc(20);
  locator.writeUInt32LE(0x07064b50);
  locator.writeUInt32LE(endOffset, 8);
  archive.writeUInt32LE(0xffffffff, endOffset + 16);
  const malformed = Buffer.concat([
    archive.subarray(0, endOffset), zip64End, locator, archive.subarray(endOffset),
  ]);

  // 修正版が外れた場合も、無限ループがテストプロセスを占有しないよう子プロセスで制限する。
  execFileSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    const { unzipSync } = createRequire(process.argv[1])('fflate');
    assert.throws(() => unzipSync(Buffer.from(process.argv[2], 'hex')), /invalid zip data/);
  `, satoriEntry, malformed.toString('hex')], { timeout: 2000 });
});

test('SVGの属性と本文に含む記号を保ち、要素の注入を防ぐ', async () => {
  const payload = 'A & B "><path data-pwned="true"/>';
  const font = await readFile(new URL('../public/ZenKakuGothicNew-Regular.ttf', import.meta.url));
  const svg = await satori(createElement('div', { style: { display: 'flex' } },
    createElement('svg', { width: 100, height: 100, 'data-label': payload },
      createElement('title', null, payload),
      createElement('rect', { width: 100, height: 100, fill: 'red' }),
    ),
  ), { width: 100, height: 100, fonts: [{ name: 'Test', data: font }] });
  const prefix = 'data:image/svg+xml;utf8,';
  const imageUrl = svg.match(/href="(data:image\/svg\+xml;utf8,[^"]+)"/)?.[1];
  assert.ok(imageUrl, 'SVG画像が出力される');
  const dom = new JSDOM(decodeURIComponent(imageUrl.slice(prefix.length)), {
    contentType: 'image/svg+xml',
  });
  try {
    const document = dom.window.document;
    assert.equal(document.documentElement.getAttribute('data-label'), payload);
    assert.equal(document.querySelector('title')?.textContent, payload);
    assert.equal(document.querySelector('[data-pwned]'), null);
  } finally {
    dom.window.close();
  }
});
