// components
import { HeroImageGallery } from '~/features/property-detail/components/hero-image-gallery';
import { RoomTypeLine } from '~/features/property-detail/components/room-type-line';
import { ClientMap } from '~/features/property-detail/components/client-map';
import { Avatar } from '@locaci/ui/components/atoms/avatar';

// utils
import { use } from 'react';
import { notFound } from 'next/navigation';
import {
    getPropertyDetail,
    getTop100RecentPropertiesUid
} from '~/server/utils';
import { Uuid } from '~/utils/uuid';
import { clsx, formatNumberToFCFA } from '@locaci/ui/lib/functions';
import { getPropertyTitle } from '~/utils/functions';

// types
import type { PageProps } from '~/types';
import type { ListingImage } from '~/features/shared/types';
import type { RoomType } from '~/features/shared/types';
import type { BoundingBox } from '~/utils/types';
import { AmenityTypeLine } from '~/features/property-detail/components/amenity-type-line';

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

            {/* Separator */}
            <div className="mx-auto max-w-[1200px] px-4 lg:px-8 xl:px-0">
                <hr className="h-[1px] w-full bg-gray" />
            </div>

            <CaracteristicsSection uid={params.uid} />

            {/* Separator */}
            <div className="mx-auto max-w-[1200px] px-4 lg:px-8 xl:px-0">
                <hr className="h-[1px] w-full bg-gray" />
            </div>

            {property.rentType === 'SHORT_TERM' && (
                <>
                    <AmenitiesSection uid={params.uid} />
                    <div className="mx-auto max-w-[1200px] px-4 lg:px-8 xl:px-0">
                        <hr className="h-[1px] w-full bg-gray" />
                    </div>
                </>
            )}

            <MapSection uid={params.uid} />

            <div className="mx-auto max-w-[1200px] px-4 lg:px-8 xl:px-0">
                <hr className="h-[1px] w-full bg-gray" />
            </div>

            <OwnerInfoSection uid={params.uid} />

            <PriceReservationSection uid={params.uid} />
        </>
    );
}

function HeroSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;
    const noOfBedRooms = property.rooms.filter(
        r => r.type === 'BEDROOM'
    ).length;
    return (
        <section
            className={clsx(
                'mx-auto mt-4 flex max-w-[1200px] flex-col gap-4 pb-4',
                'lg:gap-8'
            )}>
            <HeroImageGallery images={property.images as Array<ListingImage>} />

            <div
                className={clsx(
                    'flex flex-col gap-2 px-4',
                    'lg:gap-4 lg:px-8 xl:px-0'
                )}>
                <h1 className="text-2xl font-semibold lg:text-3xl">
                    {getPropertyTitle(property)}
                </h1>

                <div className="text-base text-dark lg:text-lg">
                    {property.noOfRooms} pièce
                    {property.noOfRooms > 1 ? 's' : ''}&nbsp;&middot;&nbsp;
                    {noOfBedRooms} chambre
                    {noOfBedRooms > 1 ? 's' : ''}&nbsp;&middot;&nbsp;
                    {property.surfaceArea} m<sup>2</sup>
                </div>
            </div>
        </section>
    );
}

function CaracteristicsSection({ uid }: { uid: string }) {
    const { rooms, description } = use(getPropertyDetail(uid))!;

    const roomTypes = rooms.reduce((preVious, currentValue) => {
        const newTypeRooms = preVious;
        const typeRoom = newTypeRooms.find(r => r.type === currentValue.type);

        if (typeRoom) {
            typeRoom.count++;
        } else {
            newTypeRooms.push({
                type: currentValue.type,
                count: 1
            });
        }
        return newTypeRooms;
    }, [] as Array<{ type: RoomType; count: number }>);

    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">A propos</h2>

            <div className="flex flex-col gap-4">
                <h3 className="text-gray">Cette maison contient : </h3>
                <div className="grid gap-2 md:gap-8">
                    {roomTypes.map(rtype => (
                        <RoomTypeLine type={rtype.type} count={rtype.count} />
                    ))}
                </div>
            </div>

            <h3 className="text-gray">Description : </h3>
            <p className="text-dark">{description}</p>
        </section>
    );
}

function AmenitiesSection({ uid }: { uid: string }) {
    const { amenities } = use(getPropertyDetail(uid))!;

    const predefinedAmenities = amenities
        .filter(amenity => amenity.type !== 'OTHER')
        .map(amenity => amenity.type);

    const customAmenities = amenities
        .filter(amenity => amenity.type === 'OTHER')
        .map(amenity => ({
            name: amenity.name as string,
            type: 'OTHER'
        })) as {
        name: string;
        type: 'OTHER';
    }[];
    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">Accessoires</h2>
            <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {predefinedAmenities.map(atype => (
                    <AmenityTypeLine type={atype} />
                ))}
                {customAmenities.map(atype => (
                    <AmenityTypeLine type={'OTHER'} name={atype.name} />
                ))}
            </div>
        </section>
    );
}

function MapSection({ uid }: { uid: string }) {
    const { locality_osm_id, localityName, locality_bbox } = use(
        getPropertyDetail(uid)
    )!;
    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4  py-8',
                'lg:gap-8'
            )}>
            <h2 className="px-4 text-xl font-semibold lg:px-8 lg:text-2xl xl:px-0">
                Addresse
            </h2>

            <p className="flex items-center gap-1 px-4 text-gray lg:px-8 xl:px-0">
                {localityName}
            </p>

            <div className="lg:px-8 xl:px-0">
                <ClientMap
                    locality_osm_id={locality_osm_id}
                    boundingbox={locality_bbox as BoundingBox}
                />
            </div>
        </section>
    );
}

function OwnerInfoSection({ uid }: { uid: string }) {
    const { owner } = use(getPropertyDetail(uid))!;

    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">
                A propos du bailleur
            </h2>

            <div className="flex items-center gap-4">
                <Avatar
                    src={owner.avatarURL}
                    name={`${owner.firstName} ${owner.lastName}`}
                    className="bg-primary"
                />

                <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                        {owner.firstName} {owner.lastName}
                    </span>
                    <span className="text-gray">
                        Inscrit depuis le&nbsp;
                        <time dateTime={owner.createdAt.toISOString()}>
                            {new Intl.DateTimeFormat('fr-FR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }).format(owner.createdAt)}
                        </time>
                    </span>
                </div>
            </div>
        </section>
    );
}

function PriceReservationSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;
    return (
        <aside className="fixed bottom-0 left-0 right-0 z-20 flex items-center bg-white px-4 py-8">
            <div>
                <span className="text-lg font-bold text-dark">
                    {formatNumberToFCFA(property.housingFee)}
                </span>
                &nbsp;
                <span className="text-gray">
                    par&nbsp;
                    {property.housingPeriod === 30
                        ? 'mois'
                        : property.housingPeriod === 7
                        ? 'semaine'
                        : 'jour'}
                </span>
            </div>

            {/* TODO: Button reservation */}
        </aside>
    );
}

function SimilarPropertiesSection({ uid }: { uid: string }) {
    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">
                Logements similaires
            </h2>
        </section>
    );
}

function MoreMunicipalitiesSection({ uid }: { uid: string }) {
    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                'lg:gap-8 lg:px-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">
                Découvrez d'autres logements dans d'autres communes
            </h2>
        </section>
    );
}
