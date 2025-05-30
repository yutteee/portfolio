import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: "Primary Button",
    color: "primary",
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    children: "Secondary Button",
    color: "secondary",
  },
}; 