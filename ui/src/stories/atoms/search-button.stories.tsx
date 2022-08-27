import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    SearchButton,
    SearchButtonProps
} from '../../components/atoms/search-button';

export default {
    title: 'Composants/Atoms/SearchButton',
    component: SearchButton
} as ComponentMeta<typeof SearchButton>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SearchButton> = args => (
    <SearchButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: 'Lancez votre recherche'
} as SearchButtonProps;
