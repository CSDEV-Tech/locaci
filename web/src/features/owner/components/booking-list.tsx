'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { RefreshIcon } from '@locaci/ui/components/atoms/icons/refresh';
import { OwnerBookingCard } from '@locaci/ui/components/molecules/owner-booking-card';
import { BookingDetailModal } from '~/features/owner/components/booking-detail-modal';

// utils
import { t } from '~/app/trpc-client-provider';
import { ListingImage } from '~/features/shared/types';
import { getPropertyTitle } from '~/lib/functions';

// types
import type { Booking } from '~/features/owner/components/booking-detail-modal';

export function BookingList() {
    const { data, hasNextPage, isFetching, fetchNextPage, refetch } =
        t.owner.property.getBookings.useInfiniteQuery(
            { limit: 8 },
            {
                getNextPageParam(lastPage) {
                    return lastPage.nextCursor;
                },
                refetchOnMount: false,
                staleTime: 5 * 60 * 1_000 // 5 minutes
            }
        );

    const [selectedBooking, setSelectedBooking] =
        React.useState<Booking | null>(null);

    return (
        <>
            <BookingDetailModal
                isOpen={selectedBooking !== null}
                onClose={() => {
                    setSelectedBooking(null);
                }}
                title={
                    selectedBooking
                        ? getPropertyTitle(selectedBooking?.property)
                        : 'Détail réservation'
                }
                booking={selectedBooking}
            />

            {data?.pages?.length === 0 ? (
                <>
                    <div className="flex w-full flex-col items-center gap-4 pt-24">
                        <img
                            src="/void_illustration.svg"
                            alt="Illustration Aucune notification"
                            className="h-44"
                        />

                        <h1 className="text-2xl font-extrabold">
                            Aucune réservation en cours.
                        </h1>

                        <p className="text-center text-gray">
                            Retrouvez toutes les réservations effectuées pour
                            votre logement à un seul endroit.
                        </p>

                        <Button
                            variant="primary"
                            loading={isFetching}
                            onClick={() => refetch()}
                            renderLeadingIcon={cls => (
                                <RefreshIcon className={cls} />
                            )}>
                            Recharger
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Button
                        variant="primary"
                        className="self-start"
                        loading={isFetching}
                        onClick={() =>
                            hasNextPage ? fetchNextPage() : refetch()
                        }
                        renderLeadingIcon={cls => (
                            <RefreshIcon className={cls} />
                        )}>
                        En charger plus
                    </Button>

                    <ul className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-1">
                        {data?.pages.map((page, index) => (
                            <React.Fragment key={index}>
                                {page.bookings.map(booking => (
                                    <li key={booking.id}>
                                        <OwnerBookingCard
                                            title={getPropertyTitle(
                                                booking.property
                                            )}
                                            applicantName={`${booking.applicant.firstName} ${booking.applicant.lastName}`}
                                            applicantAvatarURL={
                                                booking.applicant.avatarURL
                                            }
                                            dateOfReservation={
                                                booking.dateOfReservation
                                            }
                                            coverURL={
                                                (
                                                    booking.property
                                                        .images as ListingImage[]
                                                )[0].uri
                                            }
                                            onShowMore={() =>
                                                setSelectedBooking(booking)
                                            }
                                        />
                                    </li>
                                ))}
                            </React.Fragment>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}
