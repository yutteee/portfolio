import { userEvent, within, expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from ".";

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
  beforeEach: () => {
    localStorage.clear();
    document.documentElement.className = "";
  },
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
    // useFocusTrap の cleanup を含む effect flush を待つ
    await waitFor(() =>
      expect(canvas.queryByTestId("sp-menu")).not.toBeVisible(),
    );
  },
};

export const ThemeToggleInteraction: Story = {
  args: {
    currentPage: undefined,
  },
  name: "テーマトグル時に表示が切り替わる側のボタンにフォーカスが移る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    // 初期状態の「ダークモードにする」ボタンを押す
    const darkButton = await canvas.findByLabelText("ダークモードにする");
    await userEvent.click(darkButton);
    // 表示が切り替わり「ライトモードにする」ボタンにフォーカスが移る
    const lightButton = await canvas.findByLabelText("ライトモードにする");
    await waitFor(() => expect(lightButton).toHaveFocus());
    // 「ライトモードにする」ボタンを押す
    await userEvent.click(lightButton);
    // 表示が切り替わり「ダークモードにする」ボタンにフォーカスが戻る
    const darkButtonAfter = await canvas.findByLabelText("ダークモードにする");
    await expect(darkButtonAfter).toHaveFocus();
    // useThemeMode の useEffect が完全に flush されるのを待つ（テスト終了後の concurrent re-render 防止）
    await waitFor(() => expect(localStorage.getItem("theme")).toBe("light"));
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
    await waitFor(() => expect(localStorage.getItem("theme")).toBe("light"));
  },
};
