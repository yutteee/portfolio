import type { Meta, StoryObj } from "@storybook/react";
import { HogePresenter } from "./presenter";

const meta: Meta<typeof HogePresenter> = {
  title: "features/Hoge",
  component: HogePresenter,
  parameters: {
    docs: {
      description: {
        component: "HogePresenterの説明をここに記載してください。",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof HogePresenter>;

export const Default: Story = {}; 