import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from ".";

const meta: Meta<typeof Footer> = {
  title: "ui/Footer",
  component: Footer,
  tags: ["autodocs"],
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

export const Default: Story = {}; 