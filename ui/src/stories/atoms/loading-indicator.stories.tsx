import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { LoadingIndicator } from '../../components/atoms/loading-indicator';

export default {
    title: 'Composants/Atoms/LoadingIndicator',
    component: LoadingIndicator
} as Meta<typeof LoadingIndicator>;

export const Default = {
    args: {
        className: 'h-10 text-white'
    }
};
