'use client';
import * as React from 'react';
import { SearchSkeleton } from './search-skeleton';

import { useSearchStore } from '~/lib/store';

/**
 * This component is here to provide a nicer UX to our users,
 * When the user changes the filters it does not automatically retrigger the
 * suspense boundary, so we simulate a loading skeleton to indicate to the user that the results are loading
 */
export function SearchListLoadingWrapper(props: { children: React.ReactNode }) {
    const store = useSearchStore(state => ({
        isSearching: state.isSearching,
        showPagination: state.showPagination
    }));
    return (
        <>
            {store.isSearching ? (
                <SearchSkeleton hideMap showPagination={store.showPagination} />
            ) : (
                props.children
            )}
        </>
    );
}
