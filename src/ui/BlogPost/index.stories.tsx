import type { Meta, StoryObj } from "@storybook/react";
import { BlogPost } from ".";

const meta: Meta<typeof BlogPost> = {
  title: "ui/BlogPost",
  component: BlogPost,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "ブログ記事のリンクを表示するコンポーネントです。list要素のため、ul要素でラップして使用してください。",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BlogPost>;

export const Default: Story = {
  args: {
    title: "ブログタイトル",
    url: "https://example.com",
    image: "https://placehold.jp/340x178.png",
    date: "2024-06-01",
    alt: "サムネイル画像",
    isExternal: true,
  },
}; 