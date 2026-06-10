import { describe, expect, it } from "vitest";
import {
  resolveSlideImagePaths,
  SLIDE_IMAGE_PUBLIC_DIR,
  toPostSlug,
} from "./slidePostImage";

describe("toPostSlug", () => {
  it("末尾の /index を取り除く", () => {
    expect(toPostSlug({ id: "20250812/index" })).toBe("20250812");
  });

  it("/index を持たない ID はそのまま返す", () => {
    expect(toPostSlug({ id: "20250812" })).toBe("20250812");
  });
});

describe("resolveSlideImagePaths", () => {
  it("相対画像パスを public 配下の絶対パスへ書き換える", () => {
    const body = "![アイコン](icon.png)";
    expect(resolveSlideImagePaths({ body, slug: "20250812" })).toBe(
      `![アイコン](/${SLIDE_IMAGE_PUBLIC_DIR}/20250812/icon.png)`,
    );
  });

  it("Marp のサイズ指定を含む alt と ./ 始まりのパスも書き換える", () => {
    const body = "![図 w:600 h:full](./color-issue.png)";
    expect(resolveSlideImagePaths({ body, slug: "20260527" })).toBe(
      `![図 w:600 h:full](/${SLIDE_IMAGE_PUBLIC_DIR}/20260527/./color-issue.png)`,
    );
  });

  it("複数の画像をすべて書き換える", () => {
    const body = "![a](a.png)\n\n![b](b.png)";
    expect(resolveSlideImagePaths({ body, slug: "deck" })).toBe(
      `![a](/${SLIDE_IMAGE_PUBLIC_DIR}/deck/a.png)\n\n![b](/${SLIDE_IMAGE_PUBLIC_DIR}/deck/b.png)`,
    );
  });
});
