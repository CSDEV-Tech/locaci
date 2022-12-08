import * as React from 'react';

// components
import { AddButton } from './add-button';
import { ListingCard } from './listing-card';

// types
import type { DraftProperty, Property } from '@prisma/client';
import type { ListingImage } from '~/types';
export type PropertyListProps = {
    properties: Property[];
    drafts: DraftProperty[];
};

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

export function PropertyList({ properties, drafts }: PropertyListProps) {
    return (
        <>
            <>
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
                        <AddButton className="sm:self-start">
                            Ajouter un nouveau logement
                        </AddButton>

                        <ul className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-1">
                            {drafts?.map(draft => (
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

                            {properties?.map(property => (
                                <li key={property.id}>
                                    <ListingCard
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
        </>
    );
}
