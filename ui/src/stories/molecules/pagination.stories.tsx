import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Pagination } from "../../components/molecules/pagination";

export default {
  title: "Composants/Molecules/Pagination",
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Pagination> = (args) => (
  <Pagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
};
