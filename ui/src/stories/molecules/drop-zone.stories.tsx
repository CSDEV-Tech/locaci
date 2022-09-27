import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DropZone, DropZoneProps } from '../../components/molecules/drop-zone';

export default {
    title: 'Composants/Molecules/DropZone',
    component: DropZone
} as ComponentMeta<typeof DropZone>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof DropZone> = args => (
    <DropZone {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: 'min-h-[400px]',
    label: 'Ajouter une photo'
} as DropZoneProps;
