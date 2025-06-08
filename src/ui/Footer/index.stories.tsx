import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from ".";
import { FiGithub, FiTwitter, FiBookOpen, FiBook, FiUser } from 'react-icons/fi';

const meta: Meta<typeof Footer> = {
  title: "ui/Footer",
  component: Footer,
  parameters: {
    docs: {
      description: {
        component: "SNSアカウント一覧とサイトマップを表示するフッターコンポーネント。ダークモード対応。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    accounts: [
      { name: "GitHub", url: "https://github.com/", icon: <FiGithub />, alt: "GitHub" },
      { name: "X", url: "https://x.com/", icon: <FiTwitter />, alt: "X" },
      { name: "Qiita", url: "https://qiita.com/", icon: <FiBookOpen />, alt: "Qiita" },
      { name: "Zenn", url: "https://zenn.dev/", icon: <FiBook />, alt: "Zenn" },
      { name: "Wantedly", url: "https://wantedly.com/", icon: <FiUser />, alt: "Wantedly", isWantedly: true },
    ],
    siteMapUrl: "/siteMap",
  },
}; 