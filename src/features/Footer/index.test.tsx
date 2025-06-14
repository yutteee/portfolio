import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll } from 'vitest';
import { Footer } from ".";
import { accounts } from "./accounts";

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }));
});

describe("Footer", () => {
  it("アカウント名がaria-labelとして設定されている", () => {
    render(<Footer />);
    for (const acc of accounts) {
      expect(screen.getAllByLabelText(acc.name)[0]).toBeInTheDocument();
    }
  });

  it("リンクのhrefが正しい", () => {
    render(<Footer />);
    for (const acc of accounts) {
      const link = screen.getAllByLabelText(acc.name)[0];
      expect(link).toHaveAttribute("href", acc.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("サイトマップリンクが表示される", () => {
    render(<Footer />);
    expect(screen.getByText("サイトマップ")).toHaveAttribute("href", "/siteMap");
  });
}); 