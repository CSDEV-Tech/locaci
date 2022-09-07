import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextArea, TextAreaProps } from '../../components/atoms/textarea';

export default {
    title: 'Composants/Atoms/TextArea',
    component: TextArea
} as ComponentMeta<typeof TextArea>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TextArea> = args => (
    <TextArea {...args} />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Raison du refus'
} as TextAreaProps;
