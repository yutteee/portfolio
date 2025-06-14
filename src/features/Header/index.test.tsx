import { render, screen, fireEvent, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach } from 'vitest';
import { Header } from ".";
import userEvent from "@testing-library/user-event";

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

  it("スマホ用メニューのDOMが存在する", () => {
    render(<Header />);
    expect(screen.getByTestId("sp-menu")).toBeInTheDocument();
  });

  it("ハンバーガーメニュー（メニューを開くボタン）が存在する", () => {
    render(<Header />);
    expect(screen.getByLabelText("メニューを開く")).toBeInTheDocument();
  });

  it("メニューを開くを押したら、メニューを閉じるにフォーカスが移動する", () => {
    render(<Header />);
    const openButton = screen.getByLabelText("メニューを開く");
    fireEvent.click(openButton);
    const closeButton = screen.getByLabelText("メニューを閉じる");
    expect(closeButton).toHaveFocus();
  });

  it("スマホメニューでTabキーを押すとフォーカスがメニュー内でループする", async () => {
    render(<Header />);
    const user = userEvent.setup();
    // メニューを開く
    await user.click(screen.getByLabelText("メニューを開く"));
    const spMenu = screen.getByTestId("sp-menu");
    // 最初のフォーカスは閉じるボタン
    const closeButton = within(spMenu).getByLabelText("メニューを閉じる");
    expect(closeButton).toHaveFocus();
    // Tabで次の要素（トップページリンク）に移動
    await user.tab();
    expect(within(spMenu).getByRole("link", { name: "トップページ" })).toHaveFocus();
    // さらにTabで次のリンク
    await user.tab();
    expect(within(spMenu).getByRole("link", { name: "私について" })).toHaveFocus();
    // さらにTabで次のリンク
    await user.tab();
    expect(within(spMenu).getByRole("link", { name: "プロダクト" })).toHaveFocus();
    // さらにTabで次のリンク
    await user.tab();
    expect(within(spMenu).getByRole("link", { name: "記事" })).toHaveFocus();
    // さらにTabで最初（閉じるボタン）に戻る
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("ダークモードにするボタンが表示される", () => {
    render(<Header />);
    expect(screen.getByLabelText("ダークモードにする")).toBeInTheDocument();
  });

  it("ダークモードボタンを押すとライトモードボタンが表示される", async () => {
    render(<Header />);
    const darkButton = screen.getByLabelText("ダークモードにする");
    await darkButton.click();
    expect(screen.getByLabelText("ライトモードにする")).toBeInTheDocument();
  });

  it("ライトモードボタンを押したらダークモードボタンにフォーカスが当たる", async () => {
    render(<Header />);
    const lightButton = screen.getByTestId("theme-toggle-light");
    fireEvent.click(lightButton);
    const darkButton = screen.getByTestId("theme-toggle-dark");
    expect(darkButton).toHaveFocus();
  });

  it("ダークモードボタンを押すとhtmlタグにdarkクラスが付与される", async () => {
    render(<Header />);
    const darkButton = screen.getByLabelText("ダークモードにする");
    await darkButton.click();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("ライトモードボタンを押すとhtmlタグからdarkクラスが削除される", async () => {
    render(<Header />);
    const darkButton = screen.getByLabelText("ダークモードにする");
    await darkButton.click();
    const lightButton = screen.getByLabelText("ライトモードにする");
    await lightButton.click();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
}); 