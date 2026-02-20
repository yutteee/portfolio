import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from ".";

const meta: Meta<typeof Breadcrumb> = {
  title: "ui/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "パンくずリストコンポーネント。itemsにラベルとhrefを指定します。hrefを省略したアイテムは現在のページとして表示されます。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const TwoLevels: Story = {
  name: "2階層（トップ > ページ）",
  args: {
    items: [{ label: "トップ", href: "/" }, { label: "記事" }],
  },
};

export const ThreeLevels: Story = {
  name: "3階層（トップ > 記事一覧 > 記事）",
  args: {
    items: [
      { label: "トップ", href: "/" },
      { label: "記事", href: "/posts" },
      { label: "記事タイトル" },
    ],
  },
};
