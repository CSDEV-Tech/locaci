// components
import { Avatar } from '@locaci/ui/components/atoms/avatar';
import { BookingTabs } from '~/features/profile/components/booking-tabs';
import { PropertyBookingCard } from '@locaci/ui/components/molecules/property-booking-card';
import { NextLink } from '~/features/shared/components/next-link';
import Image from 'next/image';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { getUserOrRedirect } from '~/server/trpc/rsc/cached-queries';
import { use } from 'react';
import { rsc } from '~/server/trpc/rsc';
import { Uuid } from '~/lib/uuid';
import { getPropertyTitle } from '~/lib/functions';
import { formatDateToFrenchDate } from '@locaci/ui/lib/functions';

// types
import type { ListingImage } from '~/features/shared/types';

export default function ProfilePage() {
    const user = use(getUserOrRedirect());
    const { pastBookings, futureBookings } = use(rsc.user.getBookings.fetch());

    return (
        <>
            <section className={clsx('relative h-32 bg-secondary-15')}>
                <div className="relative mx-auto h-full w-full max-w-[1200px] px-4 pt-10 md:px-8">
                    <Avatar
                        className={`absolute -bottom-10 left-4 h-24 w-24 bg-secondary md:left-8`}
                        src={user!.avatarURL}
                        name={`${user.firstName} ${user.lastName}`}
                    />

                    <img
                        src={`/house_profile_illustration.svg`}
                        alt={`Image de bannière de profil`}
                        className={`absolute -right-10 bottom-0 h-full`}
                    />
                </div>
            </section>
            <section
                className={clsx('mx-auto max-w-[1200px] px-4 pt-12 md:px-8')}>
                <h2 className={`text-2xl font-bold`}>
                    {user.firstName} {user.lastName}
                </h2>
                <h3>
                    <span className="text-gray">
                        Inscrit depuis le&nbsp;
                        <time dateTime={user.createdAt.toISOString()}>
                            {formatDateToFrenchDate(user.createdAt)}
                        </time>
                    </span>
                </h3>
            </section>

            <section
                className={clsx(
                    'mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-4',
                    'md:px-8 lg:pb-16'
                )}>
                <h1 className="text-xl font-bold lg:hidden">
                    Vos réservations
                </h1>

                <BookingTabs
                    past={pastBookings.map(booking => {
                        // calculate the number of bedrooms
                        const noOfBedRooms = booking.property.rooms.filter(
                            r => r.type === 'BEDROOM'
                        ).length;

                        return (
                            <PropertyBookingCard
                                dateOfReservation={booking.dateOfReservation}
                                className="h-full w-full md:h-auto"
                                title={getPropertyTitle(booking.property)}
                                address={booking.property.localityName}
                                // @ts-ignore
                                customImage={Image}
                                numberOfRooms={booking.property.noOfRooms}
                                surfaceArea={booking.property.surfaceArea}
                                numberOfBedRooms={noOfBedRooms}
                                price={booking.property.housingFee}
                                housingPeriod={booking.property.housingPeriod}
                                customLink={NextLink}
                                href={`/properties/${new Uuid(
                                    booking.property.id
                                ).short()}`}
                                coverURL={
                                    booking.property.images
                                        ? (
                                              booking.property
                                                  .images as Array<ListingImage>
                                          )[0]?.uri
                                        : ''
                                }></PropertyBookingCard>
                        );
                    })}
                    future={futureBookings.map(booking => {
                        // calculate the number of bedrooms
                        const noOfBedRooms = booking.property.rooms.filter(
                            r => r.type === 'BEDROOM'
                        ).length;

                        return (
                            <PropertyBookingCard
                                dateOfReservation={booking.dateOfReservation}
                                className="h-full w-full md:h-auto"
                                title={getPropertyTitle(booking.property)}
                                address={booking.property.localityName}
                                // @ts-ignore
                                customImage={Image}
                                numberOfRooms={booking.property.noOfRooms}
                                surfaceArea={booking.property.surfaceArea}
                                numberOfBedRooms={noOfBedRooms}
                                price={booking.property.housingFee}
                                housingPeriod={booking.property.housingPeriod}
                                customLink={NextLink}
                                href={`/properties/${new Uuid(
                                    booking.property.id
                                ).short()}`}
                                coverURL={
                                    booking.property.images
                                        ? (
                                              booking.property
                                                  .images as Array<ListingImage>
                                          )[0]?.uri
                                        : ''
                                }></PropertyBookingCard>
                        );
                    })}
                />
            </section>
        </>
    );
}
