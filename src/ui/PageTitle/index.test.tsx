import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { PageTitle } from ".";

const DummyIcon = () => (
  <svg data-testid="icon"><title>icon</title></svg>
);

describe("PageTitle", () => {
  it("タイトルがh1要素で表示される", () => {
    render(<PageTitle title="サンプルページ" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("サンプルページ");
  });

  it("パンくずのトップリンクが存在する", () => {
    render(<PageTitle title="サンプルページ" />);
    const link = screen.getByRole("link", { name: "トップ" });
    expect(link).toHaveAttribute("href", "/");
  });
}); 