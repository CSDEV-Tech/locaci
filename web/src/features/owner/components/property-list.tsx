'use client';
import * as React from 'react';

// components
import { AddButton } from './add-button';
import { PropertyDraftCard } from './property-draft-card';

// utils
import { t } from '~/app/trpc-client-provider';

// types
import type { ListingImage } from '~/types';
import { getPropertyTitle } from '~/utils/functions';

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
                                <PropertyDraftCard
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
                                    title={getPropertyTitle(draft)}
                                />
                            </li>
                        ))}

                        {data?.properties?.map(property => (
                            <li key={property.id}>
                                <PropertyDraftCard
                                    isActiveForListing={
                                        property.activeForListing
                                    }
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
                                    title={getPropertyTitle(property)}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}
