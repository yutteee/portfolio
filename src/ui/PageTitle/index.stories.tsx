import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from ".";

const meta: Meta<typeof PageTitle> = {
	title: "ui/PageTitle",
	component: PageTitle,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"ページタイトルとパンくずを表示するコンポーネント。各ページで使用してください。タイトルはh1要素のため、PageTitleを使用しているページではh1要素は使用しないでください。",
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
