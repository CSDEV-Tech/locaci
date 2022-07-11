import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Card } from "../../components/atoms/card";

export default {
  title: "Composants/Atoms/Card",
  component: Card,
} as ComponentMeta<typeof Card>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: `Card`,
  className: `font-bold p-8`,
};

export const Link = Template.bind({});
Link.args = {
  href: `#`,
  children: `LinkCard`,
  animated: true,
  className: `font-bold p-8`,
};
