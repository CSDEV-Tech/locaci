'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { PropertyCard } from '@locaci/ui/components/molecules/property-card';
import { RefreshIcon } from '@locaci/ui/components/atoms/icons/refresh';

// utils
import { t } from '~/utils/trpc-rq-hooks';
import { getPropertyTitle } from '~/utils/functions';

// types
import type { ListingImage } from '~/types';
import Image from 'next/image';
import { NextLink } from '~/features/shared/components/next-link';

export function PropertyHomeList() {
    const { data: propertyList } = t.property.getLastThreeCreated.useQuery();
    return (
        <div className="flex w-full flex-col items-center gap-8">
            <ul className="grid w-full gap-6">
                {propertyList?.map(p => (
                    <li key={p.id}>
                        <PropertyCard
                            href={`/properties/${p.id}`}
                            title={getPropertyTitle(p)}
                            address={p.localityName}
                            // @ts-ignore
                            customImage={Image}
                            customLink={NextLink}
                            numberOfRooms={p.noOfRooms}
                            surfaceArea={p.surfaceArea}
                            price={p.housingFee}
                            housingPeriod={p.housingPeriod}
                            coverURL={
                                p.images
                                    ? (p.images as Array<ListingImage>)[0]?.uri
                                    : ''
                            }
                        />
                    </li>
                ))}
            </ul>

            <Button
                variant="primary"
                renderLeadingIcon={cls => <RefreshIcon className={cls} />}>
                En charger plus
            </Button>
        </div>
    );
}
