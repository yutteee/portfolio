import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { IconButton } from ".";

describe("IconButton", () => {
  it("icon名でFiMenuが表示される", () => {
    render(
      <IconButton
        label="メニュー"
        icon="FiMenu"
        id="icon-btn-menu"
        handleClick={() => {}}
      />,
    );
    expect(screen.getByLabelText("メニュー")).toBeInTheDocument();
  });

  it("icon名でFiArrowRightが表示される", () => {
    render(
      <IconButton
        label="次へ"
        icon="FiArrowRight"
        id="icon-btn-arrow"
        handleClick={() => {}}
      />,
    );
    expect(screen.getByLabelText("次へ")).toBeInTheDocument();
  });

  it("icon名でFiGithubが表示される", () => {
    render(
      <IconButton
        label="GitHub"
        icon="FiGithub"
        id="icon-btn-github"
        handleClick={() => {}}
      />,
    );
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
  });

  it("button要素のtypeがbuttonである", () => {
    render(<IconButton label="test" icon="FiMenu" handleClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("aria-labelが正しく設定される", () => {
    render(
      <IconButton
        label="テストアイコン"
        icon="FiMenu"
        id="icon-btn-test"
        handleClick={() => {}}
      />,
    );
    expect(screen.getByLabelText("テストアイコン")).toBeInTheDocument();
  });
});
