import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Breadcrumb } from ".";

describe("Breadcrumb", () => {
  it("nav要素にaria-labelが設定されている", () => {
    render(<Breadcrumb items={[{ label: "トップ", href: "/" }]} />);
    expect(screen.getByRole("navigation", { name: "パンくずリスト" })).toBeInTheDocument();
  });

  it("hrefがあるアイテムはリンクとして表示される", () => {
    render(
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "記事", href: "/posts" },
        ]}
      />,
    );
    const topLink = screen.getByRole("link", { name: "トップ" });
    expect(topLink).toHaveAttribute("href", "/");
    const postsLink = screen.getByRole("link", { name: "記事" });
    expect(postsLink).toHaveAttribute("href", "/posts");
  });

  it("hrefがないアイテムは現在ページとして表示される", () => {
    render(
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "現在のページ" },
        ]}
      />,
    );
    expect(screen.queryByRole("link", { name: "現在のページ" })).toBeNull();
    const current = screen.getByText("現在のページ");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("複数階層のパンくずが正しく表示される", () => {
    render(
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "記事", href: "/posts" },
          { label: "記事タイトル" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "トップ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "記事" })).toBeInTheDocument();
    expect(screen.getByText("記事タイトル")).toBeInTheDocument();
  });
});
