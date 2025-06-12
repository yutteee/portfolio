import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Hoge } from ".";

describe("Hoge", () => {
  it("レンダリングされる", () => {
    render(<Hoge />);
    // 必要に応じてテスト内容を追加
  });
}); 