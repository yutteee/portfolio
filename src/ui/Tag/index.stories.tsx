import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from ".";

const meta: Meta<typeof Tag> = {
  title: "ui/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "タグ／バッジを統一する汎用コンポーネントです。強弱は variant（primary / secondary）で表現します。",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Primary: Story = {
  args: { variant: "primary", children: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "secondary" },
};

export const TechStack: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {["TypeScript", "React", "Astro", "CSS Modules", "Vitest"].map((t) => (
        <Tag key={t} variant="secondary">
          {t}
        </Tag>
      ))}
    </div>
  ),
};
