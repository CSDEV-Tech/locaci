'use client';
import * as React from 'react';

// components
import { MapIcon } from '@locaci/ui/components/atoms/icons/map';
import { NextLinkButton } from '~/features/shared/components/next-link';

// utils
import { useURLSearchParams } from '../hooks/use-url-search-params';
import { parseSearchParams } from '~/lib/functions';
import { SquareFourIcon } from '@locaci/ui/components/atoms/icons/square-four';

// types
export type MapToggleButtonProps = {
    className?: string;
};

export function MapToggleButton(props: MapToggleButtonProps) {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);

    searchParams.delete('view');
    searchParams.append('view', searchParsed.view === 'LIST' ? 'MAP' : 'LIST');

    return (
        <NextLinkButton
            className={props.className}
            href={`/search?${searchParams.toString()}`}
            variant="dark"
            renderTrailingIcon={cls =>
                searchParsed.view === 'LIST' ? (
                    <MapIcon className={cls} />
                ) : (
                    <SquareFourIcon className={cls} />
                )
            }>
            {searchParsed.view === 'LIST' ? 'Vue Carte' : 'Vue grille'}
        </NextLinkButton>
    );
}
