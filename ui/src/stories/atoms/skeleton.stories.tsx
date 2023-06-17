import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Skeleton, SkeletonProps } from '../../components/atoms/skeleton';

export default {
    title: 'Composants/Atoms/Skeleton',
    component: Skeleton
} as Meta<typeof Skeleton>;

export const Default = {
    args: {
        className: `w-40 h-40`
    } as SkeletonProps
};
