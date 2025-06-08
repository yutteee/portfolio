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

const DummyIcon = () => (
  <svg width="24" height="24" role="img" aria-label="icon"><title>icon</title><circle cx="12" cy="12" r="12" fill="#ccc" /></svg>
);

export const Default: Story = {
  args: {
    title: "サンプルページ",
    icon: <DummyIcon />,
  },
}; 