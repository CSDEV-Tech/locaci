import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Skeleton, SkeletonProps } from '../../components/atoms/skeleton';

export default {
    title: 'Composants/Atoms/Skeleton',
    component: Skeleton
} as ComponentMeta<typeof Skeleton>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Skeleton> = args => (
    <Skeleton {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: `w-40 h-40`
} as SkeletonProps;
