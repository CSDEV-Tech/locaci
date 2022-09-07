import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
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
} as ComponentMeta<typeof Popover>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Popover> = args => <Popover {...args} />;

export const Default = Template.bind({});
Default.args = {
    className: `text-white mt-[200px]`,
    button: <Button>Solutions</Button>,
    children: (
        <form className="flex w-64 flex-col gap-2">
            <TextArea label="raison du refus" cols={20} />
            <Button variant="dark" type="submit">
                Envoyer
            </Button>
        </form>
    )
} as PopoverProps;
