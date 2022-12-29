import * as React from 'react';

// types
import type { PageProps } from '~/types';

export default function SearchPage({
    searchParams
}: PageProps<
    {},
    {
        noOfRooms?: number;
        maxPrice?: number;
        rentType?: number;
        'municipalityId[label]': string;
        'municipalityId[value]': string;
    }
>) {
    console.log({
        searchParams
    });

    return null;
}
