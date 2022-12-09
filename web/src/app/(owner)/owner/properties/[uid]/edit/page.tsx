import * as React from 'react';

// components
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';

// utils
import { notFound } from 'next/navigation';
import { rsc } from '~/server/trpc/rsc';

// types
import type { PageProps } from '~/types';

export default async function AddListingPage({
    params
}: PageProps<{ uid: string }>) {
    const property = await rsc.owner.property.getSingle.fetch({
        uid: params.uid
    });

    if (!property) {
        notFound();
    }

    return (
        <>
            <HydrateClient state={await rsc.dehydrate()}>
                <section className="relative flex h-full items-center justify-center">
                    <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                        {JSON.stringify(property, null, 2)}
                    </pre>
                </section>
            </HydrateClient>
        </>
    );
}
