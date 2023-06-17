import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
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
} as Meta<typeof Tag>;

export const Default = {
    args: {
        children: `Tag`,
        onRemove: undefined
    }
};

export const Squared = {
    args: {
        isSquared: true,
        children: (
            <>
                <BedIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
            </>
        ),
        onRemove: undefined
    }
};

export const Removable = {
    args: {
        children: `Tag`,
        onRemove: () => {
            console.log(`Clicked on tag`);
        }
    }
};
