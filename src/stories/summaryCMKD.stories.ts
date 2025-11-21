import type { Meta, StoryObj } from "@storybook/vue3-vite";
import CMKD from "../components/CMKD.vue";
import { summaryCMKD } from "./cmkd-sets/summaryCMKD";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "CMKD/Summary CMKD",
  component: CMKD,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof CMKD>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    drawingMode: "default",
    width: 800,
    labels: summaryCMKD,
    showSupportRect: false,
    showImportant: false,
    showDefaultRect: false,
    showUnreached: false,
  },
};
