import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapPin } from "../../components/atoms/map-pin";

export default {
  title: "Composants/Molecules/MapPin",
  component: MapPin,
} as ComponentMeta<typeof MapPin>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof MapPin> = (args) => <MapPin {...args} />;

export const Default = Template.bind({});
Default.args = {
  price: 50_000
};
