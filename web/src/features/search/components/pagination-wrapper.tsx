'use client';
import * as React from 'react';

// components
import { Pagination } from '@locaci/ui/components/molecules/pagination';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import { useSearchParams, useRouter } from 'next/navigation';
import { useSearchStore } from '~/lib/store';

export function PaginationWrapper() {
    const params = useSearchParams();
    const queryStr = new URLSearchParams(params);
    queryStr.delete('page');

    const router = useRouter();
    const setSearchLoadingStatus = useSearchStore(state => state.setStatus);
    const [isSearching, startTransition] = React.useTransition();
    // We synchronise the router pending state with a fallback to provide a nicer UX to the user
    React.useEffect(() => {
        setSearchLoadingStatus({
            isLoading: isSearching,
            showPagination: true
        });
    }, [isSearching]);

    return (
        <div className="flex flex-col items-center px-4 py-8 md:px-8">
            <Pagination
                onNavigate={page => {
                    startTransition(() => {
                        router.push(`/search?${queryStr}&page=${page}`);
                    });
                }}
                currentPage={Number(params?.get('page') ?? 1)}
                totalPages={5}
                getPageUrl={page => `/search?${queryStr}&page=${page}`}
                customLink={NextLink}
            />
        </div>
    );
}
