import type { Meta, StoryObj } from "@storybook/react";
import { HeaderPresenter } from "./presenter";
import type { CurrentPage } from "./presenter";
import React from "react";

const meta: Meta<typeof HeaderPresenter> = {
  title: "features/Header",
  component: HeaderPresenter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "HeaderPresenterの説明をここに記載してください。",
      },
    },
  },
};
export default meta;

const dummyRef = React.createRef<HTMLButtonElement>();
const dummyDivRef = React.createRef<HTMLDivElement>();
const dummyFn = () => {};

export const PC_Default: StoryObj<typeof HeaderPresenter> = {
  args: {
    menuOpen: false,
    onOpen: dummyFn,
    onClose: dummyFn,
    closeBtnRef: dummyRef,
    isDark: false,
    onThemeToggle: dummyFn,
    darkBtnRef: dummyRef,
    lightBtnRef: dummyRef,
    currentPage: undefined,
    spMenuRef: dummyDivRef,
  },
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const PC_CurrentAbout: StoryObj<typeof HeaderPresenter> = {
  args: {
    ...PC_Default.args,
    currentPage: "私について" as CurrentPage,
  },
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const PC_DarkMode: StoryObj<typeof HeaderPresenter> = {
  args: {
    ...PC_Default.args,
    isDark: true,
  },
  decorators: [
    (Story) => {
      React.useEffect(() => {
        document.documentElement.classList.add("dark");
        return () => document.documentElement.classList.remove("dark");
      }, []);
      return <Story />;
    },
  ],
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const SP_MenuOpen: StoryObj<typeof HeaderPresenter> = {
  args: {
    ...PC_Default.args,
    menuOpen: true,
  },
}; 