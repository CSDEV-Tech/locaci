import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown, DropdownProps } from '../../components/molecules/dropdown';
import { Avatar } from '../../components/atoms/avatar';
import { SquaresFour, SignOut } from 'phosphor-react';

export default {
    title: 'Composants/Dropdown',
    component: Dropdown,
    argTypes: {
        align: { control: 'select' }
    }
} as ComponentMeta<typeof Dropdown>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Dropdown> = args => (
    <Dropdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
    button: () => (
        <button>
            <Avatar name="John Doe" className="bg-secondary" />
        </button>
    ),
    items: [
        {
            text: 'Tableau de bord',
            Icon: SquaresFour,
            href: `#`
        },
        {
            text: 'Déconnexion',
            Icon: SignOut,
            onClick() {
                console.log('Logout');
            }
        }
    ]
} as DropdownProps;
