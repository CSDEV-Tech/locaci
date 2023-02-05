import * as React from 'react';
/**
 * We import leaflet css in a layout because when you import a css in a file
 * nextjs try to hoist it on the <head/> tag, with suspense and SSR it can cause problems
 * if imported at a random component in the tree.
 */
import 'leaflet/dist/leaflet.css';

// this is a dynamic page,
// FIXME: I shouldn't have to use this because i used searchParams,
// but nextjs still try to pre-render this page at build time
// this is f*ing bugging me 🤦🏾‍♂️
export const dynamic = 'force-dynamic';

// components
import { PaginationWrapper } from '~/features/search/components/pagination-wrapper';

// utils
import { searchSchema } from '~/lib/validation-schemas/search-schema';

// types
import type { PageProps } from '~/types';

export default function SearchPage({ searchParams }: PageProps<{}, any>) {
    const searchParsed = searchSchema.parse(searchParams);

    return (
        <>
            <section></section>
            <section className="px-4 py-8 md:px-8">
                <h1 className="text-2xl font-semibold">Votre recherche : </h1>
            </section>

            <PaginationWrapper />
        </>
    );
}
