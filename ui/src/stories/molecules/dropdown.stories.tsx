import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Dropdown, DropdownProps } from '../../components/molecules/dropdown';
import { Avatar } from '../../components/atoms/avatar';
import { SquaresFour, SignOut } from 'phosphor-react';

export default {
    title: 'Composants/Molecules/Dropdown',
    component: Dropdown,
    argTypes: {
        align: { control: 'select' }
    }
} as Meta<typeof Dropdown>;

export const Default = {
    args: {
        align: 'left',
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
    } as DropdownProps
};
