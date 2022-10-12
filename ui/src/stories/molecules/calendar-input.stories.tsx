import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    CalendarInput,
    CalendarInputProps
} from '../../components/molecules/calendar-input';

export default {
    title: 'Composants/Molecules/CalendarInput',
    component: CalendarInput
} as ComponentMeta<typeof CalendarInput>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CalendarInput> = args => (
    <CalendarInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Disponible à partir de',
    value: new Date('2023-01-21'),
    className: 'w-80'
} as CalendarInputProps;
