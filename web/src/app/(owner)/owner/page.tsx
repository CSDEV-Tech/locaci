import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';

// utils
import { getUser, rsc } from '~/server/ssr-helpers';
import { cookies } from 'next/headers';
import { use } from 'react';

// types
import type { User } from '@prisma/client';

export default async function OwnerDashboardPage() {
    const userSession = cookies().get(`__session`)?.value;
    const user = await getUser(userSession!);

    return (
        <>
            <div className="px-4 pt-10">
                <DashboardTabs
                    properties={
                        <React.Suspense
                            fallback={
                                <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                                    <h1 className="flex items-center gap-4 text-2xl">
                                        <LoadingIndicator className="h-10" />
                                        <span>
                                            Chargement de vos propriétés...
                                        </span>
                                    </h1>
                                </section>
                            }>
                            <PropertyList user={user!} />
                        </React.Suspense>
                    }
                    notifications={<></>}
                />
            </div>
        </>
    );
}

function PropertyList({ user }: { user: User }) {
    const properties = use(rsc(user).owner.property.getAll());

    return (
        <>
            <section className="flex flex-col items-center gap-4 px-4 py-10">
                {properties?.length === 0 ? (
                    <>
                        <img
                            src="/listing_not_found.svg"
                            alt="Illustration Aucune Annonce"
                            className="h-40"
                        />

                        <h1 className="text-2xl font-extrabold">
                            Aucune annonce trouvée
                        </h1>

                        <p className="text-center text-gray">
                            Créer votre première annonce pour mettre en valeur
                            votre logement et attirer les futurs locataires.
                        </p>
                        <NextLinkButton
                            variant="secondary"
                            href="/owner/add-listing">
                            Ajouter votre première annonce
                        </NextLinkButton>
                    </>
                ) : (
                    <>
                        <h1 className="text-center text-2xl font-bold">
                            Liste de vos propriétés
                        </h1>

                        <ul className="flex flex-col gap-4">
                            {properties?.map(p => (
                                <li
                                    key={p.id}
                                    className="rounded-md border p-2">
                                    <NextLink
                                        href={`/owner/properties/${p.id}`}
                                        className="flex flex-col gap-2">
                                        <span>
                                            {p.noOfRooms === 1
                                                ? 'Studio'
                                                : 'Appartement'}
                                            &nbsp;
                                            {p.rentType === 'SHORT_TERM' &&
                                                'meublé'}
                                            {p.rentType ===
                                                'SHARED_APPARTMENT' &&
                                                'en colocation'}
                                            {p.rentType === 'LOCATION' &&
                                                'Non meublé'}
                                            -&nbsp;{p.locality?.name},&nbsp;
                                            {p.commune?.name}, {p.city?.name}
                                        </span>
                                        <span>
                                            {p.noOfRooms} pièces -&nbsp;
                                            {p.surfaceArea} m<sup>2</sup>
                                        </span>
                                    </NextLink>
                                </li>
                            ))}
                        </ul>

                        <NextLinkButton
                            variant="secondary"
                            href="/owner/add-listing">
                            Ajouter une annonce
                        </NextLinkButton>
                    </>
                )}
            </section>
        </>
    );
}
