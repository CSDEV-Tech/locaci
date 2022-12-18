'use client';
import * as React from 'react';

// components
import { AddButton } from './add-button';
import { ListingCard } from './listing-card';

// utils
import { t } from '~/utils/trpc-rq-hooks';

// types
import type { DraftProperty, Property } from '@prisma/client';
import type { ListingImage } from '~/types';

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

export function PropertyList() {
    const { data } = t.owner.draft.getAll.useQuery(undefined, {
        staleTime: 60 * 60 * 1000 // 1 hour
    });

    return (
        <>
            {data?.properties.length === 0 && data?.drafts.length === 0 ? (
                <div className="mx-auto flex w-[400px] flex-col items-center gap-4 pt-28">
                    <img
                        src="/listing_not_found.svg"
                        alt="Illustration Aucune Annonce"
                        className="h-40"
                    />

                    <h1 className="text-2xl font-extrabold">
                        Aucun logement créé
                    </h1>

                    <p className="text-center text-gray">
                        Créer votre première annonce pour mettre en valeur votre
                        logement et attirer les futurs locataires.
                    </p>
                    <AddButton>Ajouter votre premier logement</AddButton>
                </div>
            ) : (
                <>
                    <AddButton className="sm:self-start">
                        Ajouter un nouveau logement
                    </AddButton>

                    <ul className="grid w-full place-content-center gap-6 sm:grid-cols-2 lg:grid-cols-1">
                        {data?.drafts.map(draft => (
                            <li key={draft.id}>
                                <ListingCard
                                    className="h-full w-full"
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

                        {data?.properties?.map(property => (
                            <li key={property.id}>
                                <ListingCard
                                    isVisible={property.activeForListing}
                                    className="h-full w-full"
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
        </>
    );
}
