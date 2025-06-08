import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Footer } from ".";
import { FiGithub, FiTwitter, FiBookOpen, FiBook, FiUser } from 'react-icons/fi';

describe("Footer", () => {
  const accounts = [
    { name: "GitHub", url: "https://github.com/", icon: <FiGithub />, alt: "GitHub" },
    { name: "X", url: "https://x.com/", icon: <FiTwitter />, alt: "X" },
    { name: "Qiita", url: "https://qiita.com/", icon: <FiBookOpen />, alt: "Qiita" },
    { name: "Zenn", url: "https://zenn.dev/", icon: <FiBook />, alt: "Zenn" },
    { name: "Wantedly", url: "https://wantedly.com/", icon: <FiUser />, alt: "Wantedly", isWantedly: true },
  ];

  it("アカウント名がaria-labelとして設定されている", () => {
    render(<Footer accounts={accounts} siteMapUrl="/siteMap" />);
    for (const acc of accounts) {
      expect(screen.getByLabelText(acc.name)).toBeInTheDocument();
    }
  });

  it("リンクのhrefが正しい", () => {
    render(<Footer accounts={accounts} siteMapUrl="/siteMap" />);
    for (const acc of accounts) {
      const link = screen.getByLabelText(acc.name);
      expect(link).toHaveAttribute("href", acc.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("サイトマップリンクが表示される", () => {
    render(<Footer accounts={accounts} siteMapUrl="/siteMap" />);
    expect(screen.getByText("サイトマップ")).toHaveAttribute("href", "/siteMap");
  });

  it("siteMapUrlが未指定の場合はサイトマップリンクが表示されない", () => {
    render(<Footer accounts={accounts} />);
    expect(screen.queryByText("サイトマップ")).not.toBeInTheDocument();
  });
}); 