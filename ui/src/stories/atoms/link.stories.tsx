import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Link } from '../../components/atoms/link';

export default {
    title: 'Composants/Atoms/Link',
    component: Link,
    argTypes: {
        target: {
            control: 'select'
        }
    }
} as ComponentMeta<typeof Link>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Link> = args => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: 'Hello world',
    href: '#',
    className: 'text-white font-semibold'
};
