import usageGuide from "../../../docs/components/IconButton.md?raw";
import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from ".";
import { FiMenu, FiArrowRight, FiGithub } from "react-icons/fi";

const meta: Meta<typeof IconButton> = {
  title: "ui/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: usageGuide,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Menu: Story = {
  args: {
    label: "メニュー",
    icon: FiMenu,
    id: "icon-btn-menu",
  },
};

export const ArrowRight: Story = {
  args: {
    label: "次へ",
    icon: FiArrowRight,
    id: "icon-btn-arrow",
  },
};

export const Github: Story = {
  args: {
    label: "GitHub",
    icon: FiGithub,
    id: "icon-btn-github",
  },
};
