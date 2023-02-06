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
import { FiltersMobile } from '~/features/search/components/filters-mobile';
import { MapToggleButton } from '~/features/search/components/map-toggle-button';
import { PropertySearchCard } from '~/features/search/components/search-card-wrapper';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import { searchSchema } from '~/lib/validation-schemas/search-schema';
import { clsx, range } from '@locaci/ui/lib/functions';
import { use } from 'react';
import { getAllMunicipalities } from '~/server/trpc/rsc/cached-queries';

// types
import type { PageProps } from '~/types';
import { wait } from '~/lib/functions';

export default function SearchPage({ searchParams }: PageProps<{}, any>) {
    const municipalityQuery = searchParams['municipalityId[label]'];
    const municipalityId = searchParams['municipalityId[value]'];

    const searchParsed = searchSchema.parse({
        ...searchParams,
        municipalityId,
        municipalityQuery
    });
    // TODO : Make search
    use(
        wait(2000).then(() =>
            console.dir(
                {
                    searchParsed
                },
                { depth: null }
            )
        )
    );

    return (
        <div className="grid gap-4 px-4 py-8">
            <section className="flex flex-col items-start gap-4">
                <h1 className="text-2xl font-semibold">
                    8 résultats Votre recherche :
                </h1>

                <div className="grid gap-4">
                    {range(0, 6).map(i => (
                        <PropertySearchCard
                            key={i}
                            address="Riviera 6, cocody, abidjan"
                            housingPeriod={30}
                            href="/search/#"
                            customLink={NextLink}
                            imagesURL={[
                                'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
                                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80',
                                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
                            ]}
                            numberOfBedRooms={1}
                            numberOfRooms={2}
                            price={50000}
                            surfaceArea={9}
                            title="Studio en colocation"
                        />
                    ))}
                </div>
            </section>

            <PaginationWrapper />

            <MapFilterSection />
        </div>
    );
}

function MapFilterSection() {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 right-0 z-20 gap-4 bg-white',
                'flex items-center justify-between',
                'px-4 py-8',
                'border-t border-gray/50',
                'md:px-8 lg:hidden'
            )}>
            <MapToggleButton />
            <FiltersMobile defaultMunicipalities={use(municipalitiesPromise)} />
        </div>
    );
}
