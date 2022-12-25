import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    Skeletons,
    SkeletonsProps
} from '../../components/molecules/skeletons';

export default {
    title: 'Composants/Molecules/Skeletons',
    component: Skeletons
} as ComponentMeta<typeof Skeletons>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Skeletons> = args => (
    <Skeletons {...args} />
);

export const Default = Template.bind({});
Default.args = {
    count: 4,
    className: 'flex gap-2 items-center',
    skeletonClass: `w-20 h-20`
} as SkeletonsProps;
