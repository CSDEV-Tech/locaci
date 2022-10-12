import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Calendar, CalendarProps } from '../../components/atoms/calendar';

export default {
    title: 'Composants/Atoms/Calendar',
    component: Calendar
} as ComponentMeta<typeof Calendar>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Calendar> = args => (
    <div className="m-4 inline-flex bg-white p-4">
        <Calendar {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as CalendarProps;
