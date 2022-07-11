import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Toggle } from "../components/toggle";

export default {
  title: "Composants/Forms/Toggle",
  component: Toggle,
  argTypes: {
    variant: {
      control: `select`,
    },
  },
} as ComponentMeta<typeof Toggle>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: false,
  title: `Activer dark mode !`,
};
