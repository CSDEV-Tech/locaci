import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Stepper, StepperProps } from '../../components/atoms/stepper';

export default {
    title: 'Composants/Atoms/Stepper',
    component: Stepper,
    argTypes: {
        variant: { control: 'select' }
    }
} as ComponentMeta<typeof Stepper>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Stepper> = args => <Stepper {...args} />;

export const Default = Template.bind({});
Default.args = {
    stepLabels: [
        'Type de logement',
        'adresse',
        'carte',
        'pièces',
        'accessoires',
        'images'
    ],
    currentStep: 3,
    className: `bg-white`
} as StepperProps;
