import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Avatar, AvatarProps } from '../../components/atoms/avatar';

export default {
    title: 'Composants/Atoms/Avatar',
    component: Avatar
} as ComponentMeta<typeof Avatar>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Avatar> = args => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: 'https://i.pravatar.cc/300',
    name: "N'Goran germaine"
} as AvatarProps;

export const WithEmptySrc = Template.bind({});
WithEmptySrc.args = {
    name: "N'Goran germaine",
    className: 'bg-secondary'
} as AvatarProps;
