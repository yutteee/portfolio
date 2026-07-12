import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from ".";

const meta: Meta<typeof Timeline> = {
  title: "ui/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "経歴などの時系列情報を縦のタイムライン形式で表示する。マーカーは PC モチーフを応用したミニモニター型。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    items: [
      {
        title: "◯◯大学入学",
        period: "2021年4月〜2025年3月",
        description: [
          "1つ目の出来事の説明文が入ります。",
          "2つ目の段落の説明文が入ります。",
        ],
        image: "https://placehold.jp/400x250.png",
        alt: "ダミー画像",
      },
      {
        title: "コンテスト優秀賞",
        period: "2022年8月",
        description: ["2つ目の出来事の説明文が入ります。"],
        image: "https://placehold.jp/400x250.png",
        alt: "ダミー画像",
      },
      {
        title: "株式会社◯◯",
        period: "2024年2月〜現在",
        description: ["3つ目の出来事の説明文が入ります。"],
        image: "https://placehold.jp/400x250.png",
        alt: "ダミー画像",
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: "◯◯大学入学",
        period: "2021年4月〜2025年3月",
        description: ["出来事の説明文が入ります。"],
        image: "https://placehold.jp/400x250.png",
        alt: "ダミー画像",
      },
    ],
  },
};
