import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Progress, ProgressProps } from '../../components/atoms/progress';

export default {
    title: 'Composants/Atoms/Progress',
    component: Progress,
    argTypes: {
        variant: {
            control: 'select'
        }
    }
} as Meta<typeof Progress>;

export const Default = {
    args: {
        value: 50
    } as ProgressProps
};
