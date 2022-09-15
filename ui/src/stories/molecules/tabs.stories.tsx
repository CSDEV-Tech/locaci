import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tabs, TabsProps } from '../../components/molecules/tabs';

export default {
    title: 'Composants/Molecules/Tabs',
    component: Tabs
} as ComponentMeta<typeof Tabs>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Tabs> = args => (
    <div className="absolute inset-0 bg-white p-4">
        <Tabs {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    children: (
        <>
            <Tabs.Header>
                <Tabs.HeaderItem>Annonces</Tabs.HeaderItem>
                <Tabs.HeaderItem>Notifications</Tabs.HeaderItem>
            </Tabs.Header>
            <Tabs.Body>
                <Tabs.Item>Annonces</Tabs.Item>
                <Tabs.Item>Notifications</Tabs.Item>
            </Tabs.Body>
        </>
    )
} as TabsProps;
