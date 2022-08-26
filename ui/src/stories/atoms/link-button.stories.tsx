import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    LinkButton,
    LinkButtonProps
} from '../../components/atoms/link-button';

export default {
    title: 'Composants/Atoms/LinkButton',
    component: LinkButton
} as ComponentMeta<typeof LinkButton>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof LinkButton> = args => (
    <LinkButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: 'Link',
    href: '#'
} as LinkButtonProps;
