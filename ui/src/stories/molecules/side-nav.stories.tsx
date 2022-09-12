import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { SideNav, SideNavProps } from '../../components/molecules/side-nav';

export default {
    title: 'Composants/Molecules/SideNav',
    component: SideNav,
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof SideNav>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SideNav> = args => <SideNav {...args} />;

export const Default = Template.bind({});
Default.args = {
    isOpen: true
} as SideNavProps;
