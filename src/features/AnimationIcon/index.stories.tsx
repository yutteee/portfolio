import { userEvent, within, expect } from "storybook/test";
import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { AnimationIcon } from ".";

const decorators: Decorator[] = [
  (Story) => {
    localStorage.clear();
    document.documentElement.className = "";
    return <Story />;
  },
];

const meta: Meta<typeof AnimationIcon> = {
  title: "features/AnimationIcon",
  component: AnimationIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "アニメーションの再生/停止を切り替えるトグルボタン。",
          "- `<html>`要素の`.stop`クラスをトグルし、ページ全体のアニメーションを制御する。",
          "- 状態は localStorage の`animation`キーに永続化される。",
          "- 設定がない場合は OS の prefers-reduced-motion を初期値に採用する。",
        ].join("  \n"),
      },
    },
  },
  decorators,
};
export default meta;

type Story = StoryObj<typeof AnimationIcon>;

export const Default: Story = {};

export const Stopped: Story = {
  name: "停止状態の見た目",
  decorators: [
    (Story) => {
      localStorage.setItem("animation", "stop");
      return <Story />;
    },
  ],
};

export const Playing: Story = {
  name: "再生状態の見た目",
  decorators: [
    (Story) => {
      localStorage.setItem("animation", "play");
      return <Story />;
    },
  ],
};

export const ToggleInteraction: Story = {
  name: "トグルボタンがフォーカスを保持したまま切り替わる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const stopButton = await canvas.findByLabelText("アニメーションを停止する");
    await userEvent.click(stopButton);
    const playButton = await canvas.findByLabelText(
      "アニメーションを有効にする",
    );
    await expect(playButton).toHaveFocus();
    await expect(document.documentElement.classList.contains("stop")).toBe(
      true,
    );
    await userEvent.click(playButton);
    const stopButtonAfter = await canvas.findByLabelText(
      "アニメーションを停止する",
    );
    await expect(stopButtonAfter).toHaveFocus();
    await expect(document.documentElement.classList.contains("stop")).toBe(
      false,
    );
  },
};
