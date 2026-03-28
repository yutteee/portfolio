import { userEvent, within, expect, fn } from "storybook/test";
import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { Header } from ".";

const decorators: Decorator[] = [
  (Story) => {
    localStorage.clear();
    document.documentElement.className = "";
    return <Story />;
  },
];

const meta: Meta<typeof Header> = {
  title: "features/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "グローバルナビゲーションを表示するヘッダーコンポーネント。",
          "- spサイズではメニューが表示される。",
          "- ライトモード/ダークモードの切り替えをする。",
          "- currentPageパラメータで「私について」「プロダクト」「記事」を切り替え可能。",
        ].join("  \n"),
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "radio" },
      options: ["私について", "プロダクト", "記事"],
      description: "現在選択中のページ",
      table: {
        type: { summary: '"私について" | "プロダクト" | "記事"' },
        defaultValue: { summary: undefined },
      },
    },
  },
  decorators,
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    currentPage: undefined,
  },
};

export const SpMenu: Story = {
  args: {
    currentPage: undefined,
  },
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  name: "スマホサイズのメニューでフォーカストラップが効く",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    // メニューを開く
    const openButton = await canvas.findByRole("button", {
      name: "メニューを開く",
    });
    await userEvent.click(openButton);
    // 閉じるボタンにフォーカスが移動する
    const closeButton = await canvas.findByRole("button", {
      name: "メニューを閉じる",
    });
    await expect(closeButton).toHaveFocus();
    // スマホメニューのTabループ
    const spMenu = await canvas.findByTestId("sp-menu");
    // 最初のフォーカスは閉じるボタン
    await expect(
      within(spMenu).getByLabelText("メニューを閉じる"),
    ).toHaveFocus();
    // Tabで次の要素（トップページリンク）に移動
    await userEvent.tab();
    await expect(
      within(spMenu).getByRole("link", { name: "トップページ" }),
    ).toHaveFocus();
    // さらにTabで次のリンク
    await userEvent.tab();
    await expect(
      within(spMenu).getByRole("link", { name: "私について" }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(
      within(spMenu).getByRole("link", { name: "プロダクト" }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(
      within(spMenu).getByRole("link", { name: "記事" }),
    ).toHaveFocus();
    // さらにTabで最初（閉じるボタン）に戻る
    await userEvent.tab();
    await expect(closeButton).toHaveFocus();
    // メニューを閉じる
    await userEvent.click(closeButton);
    // 開くボタンにフォーカスが移動する
    await expect(openButton).toHaveFocus();
  },
};

export const ThemeToggleInteraction: Story = {
  args: {
    currentPage: undefined,
  },
  name: "テーマトグルボタンがフォーカスを保持したまま切り替わる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    // ダークモードにするボタンを押す
    const darkButton = await canvas.findByLabelText("ダークモードにする");
    await userEvent.click(darkButton);
    // 同じボタンがラベル変更されフォーカスを維持している
    const lightButton = await canvas.findByLabelText("ライトモードにする");
    await expect(lightButton).toBeInTheDocument();
    await expect(lightButton).toHaveFocus();
    // ライトモードにするボタンを押す
    await userEvent.click(lightButton);
    // 同じボタンがラベル変更されフォーカスを維持している
    const darkButtonAfter = await canvas.findByLabelText("ダークモードにする");
    await expect(darkButtonAfter).toHaveFocus();
  },
};

export const DarkModeAndLightMode: Story = {
  args: {
    currentPage: undefined,
  },
  name: "ダークモード/ライトモードの切り替えが可能",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    // ダークモードボタンを押す→htmlタグにdarkクラス
    const darkButton = await canvas.findByLabelText("ダークモードにする");
    await userEvent.click(darkButton);
    await expect(document.documentElement.classList.contains("dark")).toBe(
      true,
    );
    // ライトモードボタンを押す→クラスが外れる
    const lightButton = await canvas.findByLabelText("ライトモードにする");
    await userEvent.click(lightButton);
    await expect(document.documentElement.classList.contains("dark")).toBe(
      false,
    );
  },
};
