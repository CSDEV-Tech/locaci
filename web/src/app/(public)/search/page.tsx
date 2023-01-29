import * as React from 'react';
/**
 * We import mapbox css in a layout because when you import a css in a file
 * nextjs try to hoist it on the <head/> tag, with suspense and SSR it can cause problems
 * if imported at a random component in the tree.
 */
import 'leaflet/dist/leaflet.css';

// this is a dynamic page,
// FIXME: I shouldn't have to use this because i used searchParams,
// but nextjs still try to pre-render this page at build time
// this is f*ing bugging me 🤦🏾‍♂️
export const dynamic = 'force-dynamic',
    revalidate = 0;

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
    return (
        <section className="p-8 ">
            <h1 className="text-2xl font-semibold">Search Params : </h1>
            insert
            <pre className="w-full overflow-scroll bg-dark text-white">
                {JSON.stringify(searchParams, null, 2)}
            </pre>
        </section>
    );
}
