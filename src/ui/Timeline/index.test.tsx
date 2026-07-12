import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { Timeline } from ".";

const items = [
  {
    title: "出来事1",
    period: "2021年4月",
    description: ["説明1"],
    image: "https://placehold.jp/400x250.png",
    alt: "画像1の説明",
  },
  {
    title: "出来事2",
    period: "2022年8月",
    description: ["説明2"],
    image: "https://placehold.jp/400x250.png",
    alt: "画像2の説明",
  },
];

describe("Timeline", () => {
  it("時系列リスト（ol/li）としてマークアップされる", () => {
    render(<Timeline items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("各項目のタイトルがレベル3の見出しになる", () => {
    render(<Timeline items={items} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(["出来事1", "出来事2"]);
  });

  it("画像に代替テキストが設定される", () => {
    render(<Timeline items={items} />);
    expect(screen.getByAltText("画像1の説明")).toBeInTheDocument();
    expect(screen.getByAltText("画像2の説明")).toBeInTheDocument();
  });
});
