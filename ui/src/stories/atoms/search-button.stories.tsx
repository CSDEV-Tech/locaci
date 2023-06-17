import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    SearchButton,
    SearchButtonProps
} from '../../components/atoms/search-button';

export default {
    title: 'Composants/Atoms/SearchButton',
    component: SearchButton
} as Meta<typeof SearchButton>;

export const Default = {
    args: {
        children: 'Lancez votre recherche'
    } as SearchButtonProps
};
