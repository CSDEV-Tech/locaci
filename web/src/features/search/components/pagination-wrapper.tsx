'use client';
import * as React from 'react';

// components
import { Pagination } from '@locaci/ui/components/molecules/pagination';
import { useSearchParams } from 'next/navigation';
import { NextLink } from '~/features/shared/components/next-link';

export function PaginationWrapper() {
    const params = useSearchParams();
    const queryStr = new URLSearchParams(params);
    queryStr.delete('page');

    return (
        <div className="flex flex-col items-center px-4 py-8 md:px-8">
            <Pagination
                currentPage={Number(params?.get('page') ?? 1)}
                totalPages={5}
                getPageUrl={page => `/search?${queryStr}&page=${page}`}
                customLink={NextLink}
            />
        </div>
    );
}
