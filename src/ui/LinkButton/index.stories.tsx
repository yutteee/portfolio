import type { Meta, StoryObj } from "@storybook/react";
import { LinkButton } from ".";

const meta: Meta<typeof LinkButton> = {
  title: "ui/LinkButton",
  component: LinkButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "リンクボタンはa要素です。aria-labelにはリンク先のページ名を指定してください。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
  args: {
    text: "詳細を見る",
    url: "https://example.com",
    ariaLabel: "詳細ページ",
  },
}; 