import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Tokens } from "./Tokens";

const meta = {
  title: "Design System/トークン",
  component: Tokens,
  argTypes: { mode: { control: false } },
  parameters: { layout: "fullscreen" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "デザイントークン" }),
    ).toBeVisible();
    await expect(canvas.getByRole("region", { name: "カラー" })).toBeVisible();
    const root = canvasElement.ownerDocument.documentElement;
    await expect(root.classList.contains("dark")).toBe(args.mode === "dark");
    const rootStyle = getComputedStyle(root);
    const background = canvas
      .getByRole("heading", { name: "--color-background" })
      .closest("article");
    if (!background) throw new Error("背景色の見本が見つかりません");
    const sample = background.querySelector('[aria-hidden="true"] > div');
    if (!sample) throw new Error("色の見本が見つかりません");
    await expect(getComputedStyle(sample).backgroundColor).toBe(
      rootStyle.backgroundColor,
    );
  },
} satisfies Meta<typeof Tokens>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {
  args: { mode: "light" },
  parameters: { mode: "light" },
};
export const Dark: Story = {
  args: { mode: "dark" },
  parameters: { mode: "dark" },
};
