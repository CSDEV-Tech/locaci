import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import { AddButton } from '~/features/owner/components/add-button';

// utils
import { rsc } from '~/server/trpc/rsc';
import { NextLink } from '~/features/shared/components/next-link';

export default async function OwnerDashboardPage() {
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
                            {/* @ts-ignore */}
                            <PropertyList />
                        </React.Suspense>
                    }
                    notifications={<></>}
                />
            </div>
        </>
    );
}

async function PropertyList() {
    const { properties, drafts } = await rsc.owner.draft.getAll.fetch();

    return (
        <>
            <section className="flex flex-col items-center gap-4 px-4 py-10">
                {properties?.length === 0 && drafts.length === 0 ? (
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
                        <AddButton>Ajouter votre première annonce</AddButton>
                    </>
                ) : (
                    <>
                        <h1 className="text-center text-2xl font-bold">
                            Liste de vos propriétés
                        </h1>

                        <ul className="flex flex-col gap-4">
                            {drafts?.map(p => (
                                <li
                                    key={p.id}
                                    className="rounded-md border p-2">
                                    <NextLink
                                        href={`/owner/properties/${p.id}/draft`}
                                        className="flex flex-col gap-2">
                                        <span>
                                            (brouillon)
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
                                            -&nbsp;{p.localityName},&nbsp;
                                            {p.municipalityName}, {p.cityName}
                                        </span>
                                        <span>
                                            {p.noOfRooms} pièces -&nbsp;
                                            {p.surfaceArea} m<sup>2</sup>
                                        </span>
                                    </NextLink>
                                </li>
                            ))}

                            {properties?.map(p => (
                                <li
                                    key={p.id}
                                    className="rounded-md border p-2">
                                    <NextLink
                                        href={`/owner/properties/${p.id}/edit`}
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
                                            -&nbsp;{p.localityName},&nbsp;
                                            {p.municipality.name}, {p.city.name}
                                        </span>
                                        <span>
                                            {p.noOfRooms} pièces -&nbsp;
                                            {p.surfaceArea} m<sup>2</sup>
                                        </span>
                                    </NextLink>
                                </li>
                            ))}
                        </ul>

                        <AddButton> Ajouter une nouvelle annonce</AddButton>
                    </>
                )}
            </section>
        </>
    );
}
