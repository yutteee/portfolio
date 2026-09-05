import usageGuide from "../../../docs/components/PageTitle.md?raw";
import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from ".";

const meta: Meta<typeof PageTitle> = {
  title: "ui/PageTitle",
  component: PageTitle,
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

type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
  args: {
    title: "サンプルページ",
  },
};
