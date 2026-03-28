import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { BlogPost } from "./index";

describe("BlogPost", () => {
  const baseProps = {
    title: "テストタイトル",
    url: "https://example.com",
    image: "img.png",
    date: "2024-06-01",
    alt: "サムネイル画像",
  };

  it("titleが表示される", () => {
    render(<BlogPost {...baseProps} />);
    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
  });

  it("リンクのhrefが正しい", () => {
    render(<BlogPost {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", baseProps.url);
  });

  it("aria-labelがtitleと一致する", () => {
    render(<BlogPost {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", baseProps.title);
  });

  it("外部リンクの場合、targetとrelが正しい", () => {
    render(<BlogPost {...baseProps} isExternal />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("内部リンクの場合、targetとrelが正しい", () => {
    render(<BlogPost {...baseProps} isExternal={false} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("imgのalt属性が正しい", () => {
    render(<BlogPost {...baseProps} />);
    const img = screen.getByAltText(baseProps.alt);
    expect(img).toBeInTheDocument();
  });
});
