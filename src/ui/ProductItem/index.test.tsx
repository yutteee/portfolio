import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { ProductItem } from ".";

describe("ProductItem", () => {
  const baseProps = {
    image: "https://placehold.jp/400x250.png",
    index: 1,
    title: "プロダクト名",
    description: "プロダクトの説明文が入ります。",
    url: "https://example.com",
    alt: "ダミー画像",
  };

  it("リンクのhrefとaria-labelが正しい", () => {
    render(<ProductItem {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", baseProps.url);
    expect(link).toHaveAttribute("aria-label", baseProps.title);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("画像のalt属性が正しい", () => {
    render(<ProductItem {...baseProps} />);
    expect(screen.getByAltText(baseProps.alt)).toBeInTheDocument();
  });

  it("タイトルと説明文が表示される", () => {
    render(<ProductItem {...baseProps} />);
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it("インデックスが0付きで表示される", () => {
    render(<ProductItem {...baseProps} />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });
});
