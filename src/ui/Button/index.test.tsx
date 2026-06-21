import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FiArrowRight } from "react-icons/fi";
import { Button } from ".";

describe("Button", () => {
  it("href が無い場合は button 要素になりクリックできる", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>送信</Button>);

    const button = screen.getByRole("button", { name: "送信" });
    expect(button).toHaveAttribute("type", "button");

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("href がある場合は a 要素になる", () => {
    render(
      <Button href="https://example.com" aria-label="詳細ページ">
        詳細を見る
      </Button>,
    );

    const link = screen.getByRole("link", { name: "詳細ページ" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(screen.getByText("詳細を見る")).toBeInTheDocument();
  });

  it("endIcon が表示される", () => {
    render(<Button endIcon={FiArrowRight}>次へ</Button>);
    expect(screen.getByText("次へ")).toBeInTheDocument();
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
