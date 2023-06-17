import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Calendar, CalendarProps } from '../../components/atoms/calendar';

export default {
    title: 'Composants/Atoms/Calendar',
    component: Calendar
} as Meta<typeof Calendar>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof Calendar> = args => (
    <div className="m-4 inline-flex rounded-md bg-white p-4">
        <Calendar {...args} />
    </div>
);

export const Default = {
    render: Template,
    args: {} as CalendarProps
};
