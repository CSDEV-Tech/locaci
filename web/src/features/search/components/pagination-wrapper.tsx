'use client';
import * as React from 'react';

// components
import { Pagination } from '@locaci/ui/components/molecules/pagination';
import { NextLink } from '~/features/shared/components/next-link';

// types
export type PaginationWrapperProps = {
    currentPage: number;
    totalPages: number;
    baseQueryString: string;
};

export function PaginationWrapper({
    currentPage,
    totalPages,
    baseQueryString
}: PaginationWrapperProps) {
    return (
        <div className="flex w-full flex-col items-center px-4 py-8 md:px-8">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                getPageUrl={page => `/search?${baseQueryString}&page=${page}`}
                customLink={NextLink}
            />
        </div>
    );
}
