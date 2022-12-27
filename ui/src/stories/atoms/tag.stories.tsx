import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Tag } from '../../components/atoms/tag';
import { BedIcon } from '../../components/atoms/icons/bed';

export default {
    title: 'Composants/Atoms/Tag',
    component: Tag,
    argTypes: {
        variant: {
            control: `select`
        },
        onRemove: {
            action: `Removed`
        }
    }
} as ComponentMeta<typeof Tag>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Tag> = args => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: `Tag`,
    onRemove: undefined
};

export const Squared = Template.bind({});
Squared.args = {
    isSquared: true,
    children: (
        <>
            <BedIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        </>
    ),
    onRemove: undefined
};

export const Removable = Template.bind({});
Removable.args = {
    children: `Tag`,
    onRemove: () => {
        console.log(`Clicked on tag`);
    }
};
