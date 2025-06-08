import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from ".";

const meta: Meta<typeof PageTitle> = {
  title: "ui/PageTitle",
  component: PageTitle,
  parameters: {
    docs: {
      description: {
        component: "ページタイトルとパンくずを表示するコンポーネント。アクセシビリティ対応。",
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