import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from ".";

const meta: Meta<typeof IconButton> = {
  title: "ui/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: "react-iconsのアイコン名を指定して表示できるボタン。アクセシビリティ対応。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Menu: Story = {
  args: {
    label: "メニュー",
    icon: "FiMenu",
    id: "icon-btn-menu",
  },
};

export const ArrowRight: Story = {
  args: {
    label: "次へ",
    icon: "FiArrowRight",
    id: "icon-btn-arrow",
  },
};

export const Github: Story = {
  args: {
    label: "GitHub",
    icon: "FiGithub",
    id: "icon-btn-github",
  },
}; 