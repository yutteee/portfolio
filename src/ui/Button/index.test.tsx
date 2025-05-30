import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, vi, expect } from 'vitest';
import { Button } from "./index";

describe("Button", () => {
  it("childrenが表示される", () => {
    render(<Button>テストボタン</Button>);
    expect(screen.getByText("テストボタン")).toBeInTheDocument();
  });

  it("onClickが呼ばれる", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);
    fireEvent.click(screen.getByText("クリック"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 