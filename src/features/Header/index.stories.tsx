import type { Meta, StoryObj } from "@storybook/react";
import { Header } from ".";
import type { CurrentPage } from "./presenter";

const meta: Meta<typeof Header> = {
  title: "features/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "グローバルナビゲーションを表示するヘッダーコンポーネント。",
          "- spサイズではメニューが表示される。",
          "- ライトモード/ダークモードの切り替えをする。",
          "- currentPageパラメータで「私について」「プロダクト」「記事」を切り替え可能。"
        ].join("  \n"),
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "radio" },
      options: ["私について", "プロダクト", "記事"],
      description: "現在選択中のページ",
      table: {
        type: { summary: '"私について" | "プロダクト" | "記事"' },
        defaultValue: { summary: undefined },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    currentPage: undefined,
  },
};

export const AboutCurrent: Story = {
  args: { currentPage: "私について" as CurrentPage },
  name: "currentPage: 私について"
};