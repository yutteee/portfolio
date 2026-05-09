import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AnimationIcon } from ".";

describe("AnimationIcon", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  afterEach(() => {
    document.documentElement.className = "";
  });

  describe("レンダリング", () => {
    it("停止ボタンと再生ボタンが両方ともDOMに存在する", () => {
      render(<AnimationIcon />);
      expect(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      ).toBeInTheDocument();
    });
  });

  describe("ユーザー操作", () => {
    it("停止ボタンをクリックすると、html要素にstopクラスが付与され、localStorageにstopが保存される", async () => {
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      );
      expect(document.documentElement).toHaveClass("stop");
      expect(localStorage.getItem("animation")).toBe("stop");
    });

    it("再生ボタンをクリックすると、html要素のstopクラスが除去され、localStorageにplayが保存される", async () => {
      document.documentElement.classList.add("stop");
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      );
      expect(document.documentElement).not.toHaveClass("stop");
      expect(localStorage.getItem("animation")).toBe("play");
    });

    it("停止ボタンをクリックすると、再生ボタンへフォーカスが移る", async () => {
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      );
      expect(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      ).toHaveFocus();
    });

    it("再生ボタンをクリックすると、停止ボタンへフォーカスが移る", async () => {
      document.documentElement.classList.add("stop");
      render(<AnimationIcon />);
      await userEvent.click(
        screen.getByRole("button", { name: "アニメーションを有効にする" }),
      );
      expect(
        screen.getByRole("button", { name: "アニメーションを停止する" }),
      ).toHaveFocus();
    });
  });
});
