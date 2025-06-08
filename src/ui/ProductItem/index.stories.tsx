import type { Meta, StoryObj } from "@storybook/react";
import { ProductItem } from ".";

const meta: Meta<typeof ProductItem> = {
  title: "ui/ProductItem",
  component: ProductItem,
  parameters: {
    docs: {
      description: {
        component: "プロダクト情報を表示するカード型リンク。アクセシビリティ対応。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ProductItem>;

export const Default: Story = {
  args: {
    image: "https://placehold.jp/400x250.png",
    index: 1,
    title: "プロダクト名",
    description: "プロダクトの説明文が入ります。",
    url: "https://example.com",
    alt: "ダミー画像",
  },
}; 