#!/usr/bin/env node
// ビルド後の必須ステップ（Footer 画像コピーと同様）。
// 変換ツール（emit.mjs）はビルドのたびに README 本文と各 .prompt.md の定型文を
// 英語で生成する。emit.mjs はフォーク禁止・言語設定も無いため、生成物を日本語へ
// 書き換える後処理でガイドラインを日本語に統一する。冪等。
//
//   node .design-sync/localize.mjs --out ./ds-bundle
//
// 注意: ds-bundle/ は毎ビルドで再生成されるので、build → localize → upload の順で
// 毎回実行すること（NOTES.md「Re-sync risks」参照）。

import fs from "node:fs";
import path from "node:path";

const outIdx = process.argv.indexOf("--out");
const OUT = outIdx >= 0 ? process.argv[outIdx + 1] : "./ds-bundle";
const cfg = JSON.parse(fs.readFileSync(".design-sync/config.json", "utf8"));
const GLOBAL = cfg.globalName ?? "PurpleProxima";
const PKG = cfg.pkg ?? "purple-proxima";

let changed = 0;

// ---- README.md: 生成された英語本文（`# <Global> (` 以降）を日本語に差し替え ----
const readmePath = path.join(OUT, "README.md");
if (fs.existsSync(readmePath)) {
  const src = fs.readFileSync(readmePath, "utf8");
  const marker = `# ${GLOBAL} (`;
  const at = src.indexOf(marker);
  if (at >= 0) {
    const header = src.slice(0, at).replace(/\s*$/, "\n");
    const verMatch = src.slice(at).match(/^# .*\((.+)\)/);
    const ver = verMatch ? verMatch[1] : `${PKG}`;
    const body = `# ${GLOBAL}（${ver}）

このデザインシステムは ${PKG}（実際のソースコードの React コンポーネント群）を、単一の
ブラウザグローバルにバンドルしたものです。全コンポーネントはアプリ本体と同じ実装です。

## ファイルの場所

- \`_ds_bundle.js\` — プロジェクト直下の DS 全体バンドル。全コンポーネントを
  \`window.${GLOBAL}\` に読み込む。先頭行は \`/* @ds-bundle: … */\` のメタデータヘッダー。
- \`styles.css\` — 唯一のスタイルシート入口。トークン・フォント・コンポーネントスタイル
  （\`_ds_bundle.css\`）を \`@import\` する。これ1枚を読み込めばよい。
- \`components/<group>/<Name>/<Name>.prompt.md\`（使用例＋バリアント）、\`<Name>.d.ts\`（型）、
  \`<Name>.html\`（バリアント一覧）。
- \`tokens/*.css\` — CSS カスタムプロパティ。名前はソースのまま。

特定のコンポーネントを使うときは \`components/<group>/<Name>/<Name>.prompt.md\` を読むこと。

## 読み込み方法

ページに次の2行を一度だけ追加する（React が先に読み込まれている必要がある）:

\`\`\`html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
\`\`\`

これでコンポーネントは \`window.${GLOBAL}.*\` から利用できる。ホストページ自身の React ルート
ではなく、専用の子ノード（例: \`<div id="ds-root">\`）にマウントし、ツリーの衝突を避ける:

\`\`\`jsx
const { AnimationIcon } = window.${GLOBAL};
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AnimationIcon />);
\`\`\`

各コンポーネントは**スタンドアロン**で、ラップすべき Provider はない。\`styles.css\` を
読み込めばスタイルされる（テーマは \`<html>\` の \`dark\` クラスのみで切り替わる）。
詳細はこのファイル冒頭の規約セクションを参照。

## デザイントークン

CSS カスタムプロパティはすべて \`_ds_bundle.css\` 内で定義され、名前はソースのまま。
種別ごとの一覧（色・フォントサイズ・余白・角丸・行送り・字間・線幅・影・z-index・
ブレークポイントなど）は冒頭の規約セクションのトークン表を参照。

## コンポーネント一覧

冒頭の規約セクション「正となる情報の場所」のグループ一覧を参照。各 API と使い方は
\`components/<group>/<Name>/<Name>.prompt.md\` と \`<Name>.d.ts\` にある。
`;
    const next = header + "\n" + body;
    if (next !== src) {
      fs.writeFileSync(readmePath, next);
      changed++;
      console.log("localized README.md");
    }
  }
}

// ---- 各 .prompt.md: 英語定型文と `## Props` 見出しを日本語化 ----
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".prompt.md")) localizePrompt(p);
  }
}

function localizePrompt(file) {
  let txt = fs.readFileSync(file, "utf8");
  const before = txt;
  // 1行目の定型文: "<Name> from <pkg>. Use via `window.<Global>.<Name>` ... see README.md."
  txt = txt.replace(
    /^(\w[\w-]*) from .+? see README\.md\.[ \t]*$/m,
    (_m, name) =>
      `\`${name}\` は ${PKG} のコンポーネントです。バンドル（ルートの \`_ds_bundle.js\`）` +
      `読み込み後、\`window.${GLOBAL}.${name}\` から利用します。各コンポーネントは` +
      `スタンドアロンで Provider は不要です。\`styles.css\` を読み込めばスタイルされます` +
      `（詳細は README.md）。`,
  );
  // 英語見出し
  txt = txt.replace(/^## Props[ \t]*$/m, "## プロパティ");
  if (txt !== before) {
    fs.writeFileSync(file, txt);
    changed++;
    console.log("localized " + path.relative(OUT, file));
  }
}

const compDir = path.join(OUT, "components");
if (fs.existsSync(compDir)) walk(compDir);

console.log(`localize: ${changed} file(s) updated`);
