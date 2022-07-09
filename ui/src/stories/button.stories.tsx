import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, ButtonProps } from "../components/button";
import { DotsThree, Smiley } from "phosphor-react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Composants/Button",
  component: Button,
  argTypes: {
    variant: {
      control: `select`,
    },
    type: {
      control: `select`,
    },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: "Button",
};

export const WithLeadingIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithLeadingIcon.args = {
  children: "Button",
  renderLeadingIcon: (cls) => <Smiley className={cls} />,
};

export const WithTrailingIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithTrailingIcon.args = {
  children: "Button",
  renderTrailingIcon: (cls) => <Smiley className={`${cls} rotate-180`} />,
};

export const WithBothIcons = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithBothIcons.args = {
  children: "Button",
  renderLeadingIcon: (cls) => <Smiley className={cls} />,
  renderTrailingIcon: (cls) => <Smiley className={`${cls} rotate-180`} />,
};

export const Square = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Square.args = {
  renderLeadingIcon: (cls) => <DotsThree className={cls} weight="bold" />,
  variant: `primary`,
  square: true,
};
