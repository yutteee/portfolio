import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { Header } from ".";

describe("Header", () => {
  beforeEach(() => {
    // デフォルトはライトモード扱い
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    document.documentElement.className = "";
  });

  it("header要素でレンダリングされる", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("初期ロード時にダークモードボタンにフォーカスが当たっていない", () => {
    render(<Header />);
    const darkButton = screen.getByLabelText("ダークモードにする");
    // ダークモードボタン自体にはフォーカスが当たっていない
    expect(document.activeElement).not.toBe(darkButton);
  });

  it("初期ロード時にメニューボタンにフォーカスが当たっていない", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: "メニューを開く" });
    expect(document.activeElement).not.toBe(menuButton);
  });

  it("Yutteeeという名前のリンクが存在し、homeに戻る", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: "トップ" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("PC用ナビゲーションに私について・プロダクト・記事のリンクが存在する", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", {
      name: "メインナビゲーション",
    });
    expect(nav).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: "私について" }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: "プロダクト" }),
    ).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "記事" })).toBeInTheDocument();
  });
});

describe("Headerのテーマ切替", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("ダークモードボタンをクリックすると、localStorageにdarkが保存され、html要素にdarkクラスが付く", async () => {
    render(<Header />);
    const darkButton = screen.getByLabelText("ダークモードにする");
    await userEvent.click(darkButton);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("ライトモードボタンをクリックすると、localStorageにlightが保存され、html要素のdarkクラスが外れる", async () => {
    document.documentElement.classList.add("dark");
    render(<Header />);
    const lightButton = screen.getByLabelText("ライトモードにする");
    await userEvent.click(lightButton);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
