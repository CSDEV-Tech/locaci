import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    CalendarInput,
    CalendarInputProps
} from '../../components/molecules/calendar-input';

export default {
    title: 'Composants/Molecules/CalendarInput',
    component: CalendarInput
} as Meta<typeof CalendarInput>;

export const Default = {
    args: {
        label: 'Disponible à partir de',
        value: new Date('2023-01-21'),
        className: 'w-80'
    } as CalendarInputProps
};

export const WithError = {
    args: {
        label: 'Disponible à partir de',
        value: new Date('2023-01-21'),
        className: 'w-80',
        errorText: 'Une erreur est survenue',
        helpText: `Description`
    } as CalendarInputProps
};
