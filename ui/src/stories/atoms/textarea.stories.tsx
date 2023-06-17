import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { TextArea, TextAreaProps } from '../../components/atoms/textarea';

export default {
    title: 'Composants/Atoms/TextArea',
    component: TextArea
} as Meta<typeof TextArea>;

export const Default = {
    args: {
        label: 'Raison du refus'
    } as TextAreaProps
};
