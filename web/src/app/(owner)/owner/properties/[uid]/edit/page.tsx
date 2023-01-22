import * as React from 'react';

// components
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';
import { EditPropertyPropertyForm } from '~/features/edit-property/components/edit-property-form';

// utils
import { notFound } from 'next/navigation';
import { rsc } from '~/server/trpc/rsc';

// types
import type { PageProps } from '~/types';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({
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
                    <EditPropertyPropertyForm propertyUid={property.id} />
                </section>
            </HydrateClient>
        </>
    );
}
