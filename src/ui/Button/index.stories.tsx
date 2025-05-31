import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

/**
 * ボタンコンポーネントのprops
 */
type ButtonProps = {
  /** ボタンに表示する内容 */
  children: React.ReactNode;
  /** クリック時のイベントハンドラ */
  onClick?: () => void;
  /** ボタンの色（primary/secondary） */
  color?: "primary" | "secondary";
};

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "アプリ全体で使う汎用的なボタンコンポーネントです。色やクリックイベントを指定できます。",
      },
    },
  },
  argTypes: {
    color: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
      description: "ボタンの色",
      defaultValue: "primary",
    },
    onClick: { action: "clicked" },
  },
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