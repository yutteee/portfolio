import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach } from 'vitest';
import { Header } from ".";

describe("Header", () => {
  afterEach(() => {
    document.documentElement.className = '';
  });

  it("header要素でレンダリングされる", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("Yutteeeという名前のリンクが存在し、homeに戻る", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: "トップ" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("PC用ナビゲーションに私について・プロダクト・記事のリンクが存在する", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "メインナビゲーション" });
    expect(nav).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "私について" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "プロダクト" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "記事" })).toBeInTheDocument();
  });
}); 