import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { SideNav, SideNavProps } from '../../components/molecules/side-nav';

export default {
    title: 'Composants/Molecules/SideNav',
    component: SideNav,
    parameters: {
        layout: 'fullscreen'
    }
} as Meta<typeof SideNav>;

export const Default = {
    args: {
        isOpen: true
    } as SideNavProps
};
