import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TextInput } from "../../components/atoms/input";

export default {
  title: "Composants/Atoms/Input/TextInput",
  component: TextInput,
  argTypes: {
    type: {
      control: `select`,
    },
  },
} as ComponentMeta<typeof TextInput>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TextInput> = (args) => (
  <TextInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Email",
  placeholder: `kkouakou@gmail.com`,
  className: `inline-block w-80`,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Email",
  placeholder: `kkouakou@gmail.com`,
  className: `inline-block w-80`,
  value: `kkouakou@gmail.com`,
  disabled: true,
};
