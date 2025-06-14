import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from ".";
import { FooterPresenter } from "./presenter";

const meta: Meta<typeof Footer> = {
  title: "features/Footer",
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

export const Default: Story = {};

export const PresenterDark = {
  render: () => <FooterPresenter isDark={true} />,
  name: "ダークモード", 
  parameters: { mode: "dark" }
}; 