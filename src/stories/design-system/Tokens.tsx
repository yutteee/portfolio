import type { CSSProperties } from "react";
import cssSource from "../../styles/global.css?raw";
import styles from "./tokens.module.css";

const rootDeclarations = cssSource.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? "";
const darkDeclarations =
  cssSource.match(/:root\.dark\s*\{([\s\S]*?)\}/)?.[1] ?? "";
const declarations = /(--[\w-]+)\s*:\s*([^;]+);/g;
const darkValues = new Map(
  Array.from(darkDeclarations.matchAll(declarations), (match) => [
    match[1],
    match[2].trim(),
  ]),
);
const tokens = Array.from(rootDeclarations.matchAll(declarations), (match) => ({
  name: match[1],
  value: match[2].trim(),
}));

const groups: {
  title: string;
  prefix: string;
  property?: keyof CSSProperties;
}[] = [
  { title: "カラー", prefix: "--color-", property: "backgroundColor" },
  { title: "文字サイズ", prefix: "--step-", property: "fontSize" },
  { title: "行間", prefix: "--leading-", property: "lineHeight" },
  { title: "字間", prefix: "--tracking-", property: "letterSpacing" },
  { title: "余白", prefix: "--space-", property: "width" },
  { title: "ブレークポイント", prefix: "--bp-" },
  { title: "本文の行長", prefix: "--text-" },
  { title: "角丸", prefix: "--radius-", property: "borderRadius" },
  { title: "線幅", prefix: "--border-width-", property: "borderWidth" },
  { title: "影", prefix: "--shadow-", property: "boxShadow" },
  { title: "重なり順", prefix: "--z-index-" },
  { title: "フォント", prefix: "--font-family-", property: "fontFamily" },
  { title: "文字の太さ", prefix: "--font-weight-", property: "fontWeight" },
];

export function Tokens({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <main className={styles.catalog}>
      <h1>デザイントークン</h1>
      <p>
        現在のテーマ: {mode === "dark" ? "ダーク" : "ライト"}。実際の CSS
        定義を読み込んでいます。画面幅を変えると文字サイズと余白の見本が変化します。
      </p>
      {groups.map(({ title, prefix, property }) => (
        <section key={prefix} aria-label={title}>
          <h2>{title}</h2>
          <div className={styles.grid}>
            {tokens
              .filter(({ name }) => name.startsWith(prefix))
              .map(({ name, value }) => {
                const semantic = darkValues.has(name);
                const textSample = [
                  "fontSize",
                  "lineHeight",
                  "letterSpacing",
                  "fontFamily",
                  "fontWeight",
                ].includes(property ?? "");
                return (
                  <article key={name} className={styles.card}>
                    <h3>
                      <code>{name}</code>
                    </h3>
                    {prefix === "--color-" && (
                      <small>
                        {semantic
                          ? "セマンティック（用途）"
                          : "プリミティブ（原色）"}
                      </small>
                    )}
                    <code className={styles.value}>
                      {mode === "dark"
                        ? (darkValues.get(name) ?? value)
                        : value}
                    </code>
                    {property && (
                      <div className={styles.sampleArea} aria-hidden="true">
                        {/* 見本だけは CSS のプロパティ名を動的に選び、実トークンを直接適用する。 */}
                        <div
                          className={
                            textSample ? styles.textSample : styles.sample
                          }
                          style={{ [property]: `var(${name})` }}
                        >
                          {textSample ? (
                            <>
                              画面に現れる UI が好き。
                              <br />
                              Aa 0123
                            </>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}
