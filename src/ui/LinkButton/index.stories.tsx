import type { Meta, StoryObj } from "@storybook/react";
import { LinkButton } from ".";

const meta: Meta<typeof LinkButton> = {
  title: "ui/LinkButton",
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: "テキスト＋アイコンのリンクボタン。アクセシビリティ対応。",
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
    ariaLabel: "詳細を見る",
  },
}; 