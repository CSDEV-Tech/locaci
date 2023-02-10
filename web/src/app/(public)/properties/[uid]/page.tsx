/**
 * We import leaflet css in a layout because when you import a css in a file
 * nextjs try to hoist it on the <head/> tag, with suspense and SSR it can cause problems
 * if imported at a random component in the tree.
 */
import 'leaflet/dist/leaflet.css';

// components
import Image from 'next/image';
import { Avatar } from '@locaci/ui/components/atoms/avatar';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { PropertyDetailMap } from '~/features/property-detail/components/property-detail-map';
import { PropertyCard } from '@locaci/ui/components/molecules/property-card';
import { RoomTypeLine } from '~/features/property-detail/components/room-type-line';
import { AmenityTypeLine } from '~/features/property-detail/components/amenity-type-line';
import { MunicipalityCard } from '@locaci/ui/components/molecules/municipality-card';
import { HeroImageGallery } from '~/features/property-detail/components/hero-image-gallery';

// utils
import React, { use } from 'react';
import { notFound } from 'next/navigation';
import {
    getAllMunicipalities,
    getPropertyDetail
} from '~/server/trpc/rsc/cached-queries';
import { getPropertyTitle } from '~/lib/functions';
import {
    clsx,
    formatDateToFrenchDate,
    formatNumberToFCFA
} from '@locaci/ui/lib/functions';
import { env } from '~/env/client.mjs';

// types
import type { PageProps } from '~/next-app-types';
import type { BoundingBox } from '~/lib/types';
import type { RoomType } from '~/features/shared/types';
import type { ListingImage } from '~/features/shared/types';
import { headers } from 'next/headers';

// this is a dynamic page, we are obliged to do this
// because there is a bug with next considering dynamic pages as static,
// even without generateStaticParams
export const dynamic = 'force-dynamic';

export default function DetailPage({ params }: PageProps<{ uid: string }>) {
    const isTextHTMLRequest =
        headers().get('Accept')?.includes('text/html') ?? false;

    const property = use(getPropertyDetail(params.uid, !isTextHTMLRequest));

    if (!property) {
        notFound();
    }

    return (
        <>
            <HeroSection uid={params.uid} />

            <div
                className={clsx(
                    'mx-auto grid max-w-[1200px] place-content-stretch place-items-stretch',
                    'lg:grid-cols-5 xl:gap-8'
                )}>
                <div className="flex flex-col lg:col-span-3">
                    <TitleSection uid={params.uid} />

                    {/* Separator */}
                    <div className="w-full px-4 md:px-8 xl:px-0">
                        <hr className="h-[1px] w-full bg-gray" />
                    </div>

                    <CaracteristicsSection uid={params.uid} />

                    {/* Separator */}
                    <div className="px-4 md:px-8 xl:px-0">
                        <hr className="h-[1px] w-full bg-gray" />
                    </div>

                    {property?.rentType === 'SHORT_TERM' && (
                        <>
                            <AmenitiesSection uid={params.uid} />
                            <div className="px-4 md:px-8 xl:px-0">
                                <hr className="h-[1px] w-full bg-gray" />
                            </div>
                        </>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="top-4 flex flex-col gap-4 lg:sticky">
                        <PriceReservationSection uid={params.uid} />
                        <OwnerInfoDesktopSection uid={params.uid} />
                    </div>
                </div>
            </div>

            <MapSection uid={params.uid} />

            <div className="px-4 lg:hidden">
                <hr className="h-[1px] w-full bg-gray" />
            </div>

            <OwnerInfoMobileSection uid={params.uid} />

            <SimilarPropertiesSection uid={params.uid} />

            <MoreMunicipalitiesSection />
        </>
    );
}

function HeroSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;
    return (
        <section
            className={clsx(
                'mx-auto mt-4 flex max-w-[1200px] flex-col',
                'lg:gap-8'
            )}>
            <HeroImageGallery
                images={property.images as Array<ListingImage>}
                propertyLink={`${env.NEXT_PUBLIC_SITE_URL}/properties/${uid}`}
            />
        </section>
    );
}

function TitleSection({ uid }: { uid: string }) {
    const property = use(getPropertyDetail(uid))!;
    const noOfBedRooms = property.rooms.filter(
        r => r.type === 'BEDROOM'
    ).length;
    return (
        <section
            className={clsx(
                'flex flex-col gap-4 pt-4 pb-4',
                'lg:gap-8 lg:pt-8'
            )}>
            <div
                className={clsx(
                    'flex flex-col gap-2 px-4',
                    'md:px-8 lg:gap-4 xl:px-0'
                )}>
                <h1 className="text-2xl font-semibold lg:text-3xl">
                    {getPropertyTitle(property)}
                </h1>

                <p className="flex items-center gap-1 text-gray">
                    {property.localityName}
                </p>

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
                'flex flex-col gap-4 px-4 py-8',
                'md:px-8 lg:gap-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">A propos</h2>

            <div className="flex flex-col gap-4">
                <h3 className="text-gray">Cette maison contient : </h3>
                <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {roomTypes.map((rtype, index) => (
                        <RoomTypeLine
                            type={rtype.type}
                            count={rtype.count}
                            key={index}
                        />
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
                'flex flex-col gap-4 px-4 py-8',
                'md:px-8 lg:gap-8 xl:px-0'
            )}>
            <h2 className="text-xl font-semibold lg:text-2xl">Accessoires</h2>
            <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {predefinedAmenities.map((atype, index) => (
                    <AmenityTypeLine type={atype} key={`pre-at-${index}`} />
                ))}
                {customAmenities.map((atype, index) => (
                    <AmenityTypeLine
                        type={'OTHER'}
                        name={atype.name}
                        key={`cust-at-${index}`}
                    />
                ))}
            </div>
        </section>
    );
}

function MapSection({ uid }: { uid: string }) {
    const {
        locality_osm_id,
        localityName,
        locality_bbox,
        addressInstructions
    } = use(getPropertyDetail(uid))!;
    return (
        <section
            className={clsx(
                'mx-auto flex max-w-[1200px] flex-col gap-4  py-8',
                'lg:gap-8'
            )}>
            <h2 className="px-4 text-xl font-semibold md:px-8 lg:text-2xl xl:px-0">
                Addresse sur la carte
            </h2>

            <p className="flex items-center gap-1 px-4 text-dark md:px-8 xl:px-0">
                {localityName}
            </p>

            {addressInstructions && (
                <>
                    <h3 className="px-4 text-gray md:px-8 xl:px-0">
                        Instructions sur l'addresse :
                    </h3>
                    <p className="px-4 text-dark md:px-8 xl:px-0">
                        {addressInstructions}
                    </p>
                </>
            )}

            <div className="md:px-8 xl:px-0">
                <PropertyDetailMap
                    locality_osm_id={locality_osm_id}
                    boundingbox={locality_bbox as BoundingBox}
                />
            </div>
        </section>
    );
}

function OwnerInfoMobileSection({ uid }: { uid: string }) {
    const { owner } = use(getPropertyDetail(uid))!;

    return (
        <section className={clsx('flex flex-col gap-4 px-4 py-8', 'lg:hidden')}>
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

function OwnerInfoDesktopSection({ uid }: { uid: string }) {
    const { owner } = use(getPropertyDetail(uid))!;

    return (
        <section
            className={clsx(
                'hidden lg:flex',
                'mr-8 flex-col gap-8 px-5 py-8',
                'rounded-md border border-gray/50',
                'lg:p-8',
                'xl:mx-0'
            )}>
            <h2 className="text-lg font-semibold lg:text-2xl">
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
                            {formatDateToFrenchDate(owner.createdAt)}
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
        <aside
            className={clsx(
                'fixed bottom-0 left-0 right-0 z-20 bg-white',
                'flex items-center justify-between',
                'px-4 py-8',
                'border-t border-gray/50',
                'lg:p-8',
                'lg:static lg:rounded-md lg:border',
                'lg:mr-8 lg:mt-8',
                'xl:mx-0'
            )}>
            <div>
                <span className="text-lg font-bold text-dark lg:text-xl">
                    {formatNumberToFCFA(property.housingFee)}
                </span>
                &nbsp;
                <span className="text-gray lg:text-lg">
                    par&nbsp;
                    {property.housingPeriod === 30
                        ? 'mois'
                        : property.housingPeriod === 7
                        ? 'semaine'
                        : 'jour'}
                </span>
            </div>

            <NextLinkButton
                variant="primary"
                href={`/properties/${uid}/book`}
                dynamic>
                Réserver
            </NextLinkButton>
        </aside>
    );
}

function SimilarPropertiesSection({ uid }: { uid: string }) {
    const { similar } = use(getPropertyDetail(uid))!;
    return similar.length > 0 ? (
        <>
            <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
                <hr className="h-[1px] w-full bg-gray" />
            </div>
            <section
                className={clsx(
                    'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                    'md:px-8 lg:gap-8 xl:px-0'
                )}>
                <h2 className="text-xl font-semibold lg:text-2xl">
                    Logements similaires
                </h2>

                <ul className="grid w-full auto-rows-max place-items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-14">
                    {similar.map(p => (
                        <li key={p.id} className={`w-full`}>
                            <PropertyCard
                                href={`/properties/${p.id}`}
                                className="h-full w-full"
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
                                        ? (p.images as Array<ListingImage>)[0]
                                              ?.uri
                                        : ''
                                }
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    ) : null;
}

function MoreMunicipalitiesSection() {
    const municipalities = use(getAllMunicipalities())
        .filter(m => m.previewPhotoURL !== null && m.propertyCount > 0)
        .slice(0, 9);
    return (
        <>
            <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
                <hr className="h-[1px] w-full bg-gray" />
            </div>
            <section
                className={clsx(
                    'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8',
                    'md:px-8 lg:gap-8 lg:pb-16 xl:px-0'
                )}>
                <h2 className="text-xl font-semibold lg:text-2xl">
                    Découvrez d'autres logements dans d'autres communes
                </h2>

                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {municipalities.map(m => (
                        <li key={m.id}>
                            <MunicipalityCard
                                name={m.name}
                                coverURL={m.previewPhotoURL!}
                                // @ts-ignore
                                customImage={Image}
                                customLink={NextLink}
                                noOfListings={m.propertyCount}
                                href={`/search?municipalityId[label]=${m.name}&municipalityId[value]=${m.id}`}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
