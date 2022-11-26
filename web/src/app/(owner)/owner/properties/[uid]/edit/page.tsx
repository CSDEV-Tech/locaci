import * as React from 'react';

// components
import { EditPropertyForm } from '~/features/edit-property/components/edit-property-form';

// utils
import { cookies } from 'next/headers';
import { rsc } from '~/server/ssr-helpers';
import { getUser } from '~/server/ssr-helpers';
import { notFound } from 'next/navigation';

// types
import type { PageProps } from '~/types';

export default async function AddListingPage({
    params: { uid }
}: PageProps<{ uid: string }>) {
    const user = await getUser(cookies().get('__session')?.value ?? '');

    const property = await rsc(user).owner.property.getSingle({
        uid
    });

    if (!property) {
        notFound();
    }

    return (
        <section className="relative flex h-full items-center justify-center">
            <EditPropertyForm property={property} />
        </section>
    );
}
