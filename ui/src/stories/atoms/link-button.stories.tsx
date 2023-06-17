import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    LinkButton,
    LinkButtonProps
} from '../../components/atoms/link-button';

export default {
    title: 'Composants/Atoms/LinkButton',
    component: LinkButton,
    argTypes: {
        variant: {
            control: `select`
        },
        target: {
            control: `select`
        }
    }
} as Meta<typeof LinkButton>;

export const Default = {
    args: {
        children: 'Link',
        href: '#'
    } as LinkButtonProps
};
