import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Avatar, AvatarProps } from '../../components/atoms/avatar';

export default {
    title: 'Composants/Atoms/Avatar',
    component: Avatar
} as Meta<typeof Avatar>;

export const Default = {
    args: {
        src: 'https://i.pravatar.cc/300',
        name: "N'Goran germaine"
    } as AvatarProps
};

export const WithEmptySrc = {
    args: {
        name: "N'Goran germaine",
        className: 'bg-secondary'
    } as AvatarProps
};
