import * as React from 'react';

// components
import { EditDraftPropertyForm } from '~/features/edit-property/components/edit-draft-property-form';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';

// utils
import { notFound } from 'next/navigation';
import { rsc } from '~/server/trpc/rsc';

// types
import type { PageProps } from '~/next-app-types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: 'Créer un nouveau logement'
};

export default async function AddDraftPage({
    params
}: PageProps<{ uid: string }>) {
    const propertyDraft = await rsc.owner.draft.getSingleDraft.fetch({
        uid: params.uid
    });

    if (!propertyDraft) {
        notFound();
    }

    return (
        <HydrateClient state={await rsc.dehydrate()}>
            <section className="relative flex h-full items-center justify-center">
                <EditDraftPropertyForm propertyDraftUid={propertyDraft.id} />
            </section>
        </HydrateClient>
    );
}
