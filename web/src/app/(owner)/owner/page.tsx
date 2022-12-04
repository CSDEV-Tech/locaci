import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import { AddButton } from '~/features/owner/components/add-button';
import { NextLink } from '~/features/shared/components/next-link';
import { ListingCard } from '~/features/owner/components/listing-card';

// utils
import { rsc } from '~/server/trpc/rsc';

// types
import type { ListingImage } from '~/types';
import type { DraftProperty, Property } from '@prisma/client';

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

    function getTitle(item: DraftProperty | Property) {
        const type = item.noOfRooms === 1 ? 'Studio' : 'Appartement';

        const label =
            item.rentType === 'SHORT_TERM'
                ? 'meublé'
                : item.rentType === 'SHARED_APPARTMENT'
                ? 'en colocation'
                : 'Non meublé';

        return `${type} ${label}`;
    }

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
                        <AddButton>Ajouter votre premièr logement</AddButton>
                    </>
                ) : (
                    <>
                        <h1 className="text-center text-2xl font-bold sm:self-start">
                            Liste de vos Logements
                        </h1>

                        <AddButton className="sm:self-start">
                            Ajouter un nouveau logement
                        </AddButton>

                        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                            {drafts?.map(draft => (
                                <li key={draft.id} className="h-full">
                                    <ListingCard
                                        className="h-full"
                                        coverURL={
                                            draft.images
                                                ? (
                                                      draft.images as Array<ListingImage>
                                                  )[0]?.uri
                                                : ''
                                        }
                                        href={`/owner/properties/${draft.id}/draft`}
                                        isDraft
                                        id={draft.id}
                                        address={draft.localityName ?? ''}
                                        numberOfRooms={draft.noOfRooms ?? 0}
                                        surfaceArea={draft.surfaceArea}
                                        title={getTitle(draft)}
                                    />
                                </li>
                            ))}

                            {properties?.map(property => (
                                <li key={property.id} className="h-full">
                                    <ListingCard
                                        className="h-full"
                                        coverURL={
                                            property.images
                                                ? (
                                                      property.images as Array<ListingImage>
                                                  )[0]?.uri
                                                : ''
                                        }
                                        href={`/owner/properties/${property.id}/edit`}
                                        id={property.id}
                                        address={property.localityName ?? ''}
                                        numberOfRooms={property.noOfRooms ?? 0}
                                        surfaceArea={property.surfaceArea}
                                        title={getTitle(property)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </>
    );
}
