// components
import { MapPinIcon } from '@locaci/ui/components/atoms/icons/map-pin';

// utils
import { use } from 'react';
import { notFound } from 'next/navigation';
import {
    getPropertyDetail,
    getTop100RecentPropertiesUid
} from '~/server/utils';
import { PageProps } from '~/types';
import { Uuid } from '~/utils/uuid';
import { clsx } from '@locaci/ui/lib/functions';

// types
import type { ListingImage } from '~/features/shared/types';
import Image from 'next/image';
import { getPropertyTitle, wait } from '~/utils/functions';
import { HeroImageGallery } from '~/features/property-detail/components/hero-image-gallery';

// This page is static but only if prebuilt
export const dynamic = 'force-static',
    dynamicParams = true;

export async function generateStaticParams() {
    const propertyIds = await getTop100RecentPropertiesUid();
    return propertyIds.map(({ id }) => ({
        uid: new Uuid(id).short()
    }));
}

export default function DetailPage({ params }: PageProps<{ uid: string }>) {
    const property = use(getPropertyDetail(params.uid));

    if (!property) {
        notFound();
    }

    return (
        <>
            <HeroSection uid={params.uid} />
            <CaracteristicsSection uid={params.uid} />
        </>
    );
}

export function HeroSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;

    return (
        <section
            className={clsx(
                'mx-auto mt-4 flex max-w-[1200px] flex-col gap-4',
                'lg:gap-8'
            )}>
            <HeroImageGallery images={property.images as Array<ListingImage>} />

            <div
                className={clsx(
                    'flex flex-col gap-2 px-4',
                    'lg:gap-4 lg:px-8'
                )}>
                <h1 className="text-2xl font-semibold lg:text-3xl">
                    {getPropertyTitle(property)}
                </h1>
                <h2 className="flex items-center gap-1 text-sm text-gray md:text-base">
                    <MapPinIcon
                        className="h-6 w-6 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <span>{property.localityName}</span>
                </h2>
            </div>

            <div className="px-4 lg:px-8">
                <hr className="h-[1px] w-full bg-gray" />
            </div>
        </section>
    );
}

export function CaracteristicsSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;

    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">A propos</h2>
        </section>
    );
}
