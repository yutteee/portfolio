import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { AnimationIcon } from ".";

describe("AnimationIcon", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
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
    window.matchMedia = originalMatchMedia;
  });

  describe("初期表示", () => {
    it("localStorageがplayの場合、停止ボタンが表示される", () => {
      localStorage.setItem("animation", "play");
      render(<AnimationIcon />);
      expect(document.documentElement).not.toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      ).toBeInTheDocument();
    });

    it("localStorageがstopの場合、再生ボタンが表示される", () => {
      localStorage.setItem("animation", "stop");
      render(<AnimationIcon />);
      expect(document.documentElement).toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      ).toBeInTheDocument();
    });

    it("localStorageに設定がなくOSがprefers-reduced-motionの場合、再生ボタンが表示される", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      render(<AnimationIcon />);
      expect(document.documentElement).toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      ).toBeInTheDocument();
    });

    it("localStorageに設定がなくprefers-reduced-motionでもない場合、停止ボタンが表示される", () => {
      render(<AnimationIcon />);
      expect(document.documentElement).not.toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      ).toBeInTheDocument();
    });
  });

  describe("ユーザー操作", () => {
    it("停止ボタンをクリックすると、localStorageにstopが保存され、再生ボタンに切り替わる", async () => {
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      );
      expect(localStorage.getItem("animation")).toBe("stop");
      expect(document.documentElement).toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      ).toBeInTheDocument();
    });

    it("再生ボタンをクリックすると、localStorageにplayが保存され、停止ボタンに切り替わる", async () => {
      localStorage.setItem("animation", "stop");
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      );
      expect(localStorage.getItem("animation")).toBe("play");
      expect(document.documentElement).not.toHaveClass("stop");
      expect(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      ).toBeInTheDocument();
    });
  });
});
