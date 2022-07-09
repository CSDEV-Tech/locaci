import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Tag } from "../components/tag";

export default {
  title: "Composants/Tag",
  component: Tag,
  argTypes: {
    variant: {
      control: `select`,
    },
    onRemove: {
      action: `Removed`,
    },
  },
} as ComponentMeta<typeof Tag>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: `Tag`,
  onRemove: undefined,
};

export const Removable = Template.bind({});
Removable.args = {
  children: `Tag`,
  onRemove: () => {
    console.log(`Clicked on tag`);
  },
};
