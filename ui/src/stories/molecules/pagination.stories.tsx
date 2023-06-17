import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import {
    Pagination,
    PaginationProps
} from '../../components/molecules/pagination';

export default {
    title: 'Composants/Molecules/Pagination',
    component: Pagination
} as Meta<typeof Pagination>;

export const Default = {
    args: {
        totalPages: 10,
        currentPage: 1,
        getPageUrl: page => `#/${page}`
    } as PaginationProps
};
