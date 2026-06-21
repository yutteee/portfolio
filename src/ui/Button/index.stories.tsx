import type { Meta, StoryObj } from "@storybook/react";
import { FiArrowRight, FiGithub } from "react-icons/fi";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "汎用ボタン。href を渡すと a 要素、渡さなければ button 要素としてレンダリングされます。startIcon / endIcon に react-icons のアイコンを渡せます。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "ボタン",
  },
};

export const WithEndIcon: Story = {
  args: {
    children: "詳細を見る",
    endIcon: FiArrowRight,
  },
};

export const WithStartIcon: Story = {
  args: {
    children: "GitHub",
    startIcon: FiGithub,
  },
};

export const AsLink: Story = {
  args: {
    children: "一覧",
    href: "/posts/",
    "aria-label": "記事一覧",
    endIcon: FiArrowRight,
  },
};
