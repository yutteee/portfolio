import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Breadcrumb } from ".";

describe("Breadcrumb", () => {
  it("nav要素にaria-labelが設定されている", () => {
    render(<Breadcrumb items={[{ label: "トップ", href: "/" }]} currentLabel="現在のページ" />);
    expect(screen.getByRole("navigation", { name: "パンくずリスト" })).toBeInTheDocument();
  });

  it("itemsのリンクが正しく表示される", () => {
    render(
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "記事", href: "/posts" },
        ]}
        currentLabel="記事タイトル"
      />,
    );
    const topLink = screen.getByRole("link", { name: "トップ" });
    expect(topLink).toHaveAttribute("href", "/");
    const postsLink = screen.getByRole("link", { name: "記事" });
    expect(postsLink).toHaveAttribute("href", "/posts");
  });

  it("currentLabelは現在のページとして表示され、リンクではない", () => {
    render(
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }]}
        currentLabel="現在のページ"
      />,
    );
    expect(screen.queryByRole("link", { name: "現在のページ" })).toBeNull();
    const current = screen.getByText("現在のページ");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("ol要素にrole=listが設定されている", () => {
    render(<Breadcrumb items={[{ label: "トップ", href: "/" }]} currentLabel="現在のページ" />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
