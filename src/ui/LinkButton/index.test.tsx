import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { LinkButton } from ".";

describe("LinkButton", () => {
  const baseProps = {
    text: "詳細を見る",
    url: "https://example.com",
    ariaLabel: "詳細ページ",
  };

  it("リンクのhrefとaria-labelが正しい", () => {
    render(<LinkButton {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", baseProps.url);
    expect(link).toHaveAttribute("aria-label", baseProps.ariaLabel);
  });

  it("テキストが表示される", () => {
    render(<LinkButton {...baseProps} />);
    expect(screen.getByText(baseProps.text)).toBeInTheDocument();
  });
}); 