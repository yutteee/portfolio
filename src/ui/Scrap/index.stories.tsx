import usageGuide from "../../../docs/components/Scrap.md?raw";
import type { Meta, StoryObj } from "@storybook/react";
import { Scrap } from ".";

const meta: Meta<typeof Scrap> = {
  title: "ui/Scrap",
  component: Scrap,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: usageGuide,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Scrap>;

export const Default: Story = {
  args: {
    pubDate: "2026-05-12",
    title: "MITライセンス",
    description:
      "世界で最も人気があり、広く使われているオープンソースライセンスの一つ。",
  },
  render: (args) => (
    <Scrap {...args}>
      <h2>詳細</h2>
      <blockquote>
        上記の著作権表示および本許諾表示を、ソフトウェアの全ての複製または実質的な部分に記載するものとします。
      </blockquote>
      <p>
        MITライセンスの製品を使用する際は、著作権表示と許諾表示を必ず記載する必要があることに気をつける。
      </p>
      <h2>参考</h2>
      <ul>
        <li>
          <a href="https://opensource.org/license/mit">The MIT License</a>
        </li>
      </ul>
    </Scrap>
  ),
};
