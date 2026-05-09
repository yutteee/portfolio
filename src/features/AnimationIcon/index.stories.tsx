import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { AnimationIcon } from ".";

const decorators: Decorator[] = [
  (Story) => {
    localStorage.clear();
    document.documentElement.classList.remove("stop");
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
          "- 停止ボタンと再生ボタンを両方DOMに置き、`<html>.stop`の有無でCSSが片方を`display: none`する設計。",
          "- これにより、SSR出力と最終状態が一致し、ハイドレーション時のちらつき（FOUC）が発生しない。",
          "- クリック時は`<html>`要素の`.stop`クラスをトグルし、localStorageの`animation`キーに永続化する。",
          "- 初期状態（localStorage / prefers-reduced-motion）の解決はBaseLayoutのinline scriptが担う。",
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
      // BaseLayout の inline script が paint 前に行う処理を再現
      document.documentElement.classList.add("stop");
      return <Story />;
    },
  ],
};

export const Playing: Story = {
  name: "再生状態の見た目",
  decorators: [
    (Story) => {
      localStorage.setItem("animation", "play");
      document.documentElement.classList.remove("stop");
      return <Story />;
    },
  ],
};

export const ToggleInteraction: Story = {
  name: "クリックで表示ボタンが切り替わりフォーカスを保持する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const stopButton = await canvas.findByLabelText("アニメーションを停止する");
    await userEvent.click(stopButton);
    await expect(document.documentElement.classList.contains("stop")).toBe(
      true,
    );
    const playButton = await canvas.findByLabelText(
      "アニメーションを有効にする",
    );
    await expect(playButton).toHaveFocus();
    await userEvent.click(playButton);
    await expect(document.documentElement.classList.contains("stop")).toBe(
      false,
    );
    await expect(stopButton).toHaveFocus();
  },
};
