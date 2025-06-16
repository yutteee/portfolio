import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { AnimationIcon } from ".";

describe("AnimationIcon", () => {
  it("レンダリングされる", () => {
    render(<AnimationIcon />);
    // 必要に応じてテスト内容を追加
  });

  it("「アニメーションを有効にする」というラベルのIconButtonがレンダリングされる", () => {
    render(<AnimationIcon />);
    expect(screen.getByRole('button', { name: 'アニメーションを有効にする' })).toBeInTheDocument();
  });
}); 