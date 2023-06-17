import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Link } from '../../components/atoms/link';

export default {
    title: 'Composants/Atoms/Link',
    component: Link,
    argTypes: {
        target: {
            control: 'select'
        }
    }
} as Meta<typeof Link>;

export const Default = {
    args: {
        children: 'Hello world',
        href: '#',
        className: 'text-white font-semibold'
    }
};
