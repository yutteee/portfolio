import type { Meta, StoryObj } from "@storybook/react";
import { AnimationIconPresenter } from "./presenter";

const meta: Meta<typeof AnimationIconPresenter> = {
  title: "features/AnimationIcon",
  component: AnimationIconPresenter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "AnimationIconPresenterの説明をここに記載してください。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AnimationIconPresenter>;

export const Default: Story = {}; 