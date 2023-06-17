import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Popover, PopoverProps } from '../../components/molecules/popover';
import { TextArea } from '../../components/atoms/textarea';
import { Button } from '../../components/atoms/button';

export default {
    title: 'Composants/Molecules/Popover',
    component: Popover,
    argTypes: {
        alignInline: {
            control: `select`
        },
        alignBlock: {
            control: `select`
        }
    }
} as Meta<typeof Popover>;

export const Default = {
    args: {
        className: `text-white mt-[200px]`,
        button: open => <Button>Solutions {open && '(Ouvert)'}</Button>,
        children: (
            <form className="flex w-64 flex-col gap-2">
                <TextArea label="raison du refus" cols={20} />
                <Button variant="dark" type="submit">
                    Envoyer
                </Button>
            </form>
        )
    } as PopoverProps
};
