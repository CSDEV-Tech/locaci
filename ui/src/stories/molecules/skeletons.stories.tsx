import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    Skeletons,
    SkeletonsProps
} from '../../components/molecules/skeletons';

export default {
    title: 'Composants/Molecules/Skeletons',
    component: Skeletons
} as Meta<typeof Skeletons>;

export const Default = {
    args: {
        count: 4,
        className: 'flex gap-2 items-center',
        skeletonClass: `w-20 h-20`
    } as SkeletonsProps
};
