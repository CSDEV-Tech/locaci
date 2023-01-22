'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';
import Image from 'next/image';

// utils
import { PropertyPresentationCard } from '@locaci/ui/components/molecules/property-presentation-card';
import { getPropertyTitle } from '~/lib/functions';
import { formatDateToFrenchDate } from '@locaci/ui/lib/functions';

// types
import type { ArrayElement, RouterOutput } from '~/lib/types';
import type { ListingImage } from '~/features/shared/types';

export type Booking = ArrayElement<
    RouterOutput['owner']['property']['getBookings']['bookings']
>;

export type BookingDetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    booking?: Booking | null;
};

export function BookingDetailModal({
    isOpen,
    onClose,
    title,
    booking: b
}: BookingDetailModalProps) {
    return (
        <ResponsiveModal isOpen={isOpen} title={title} onClose={onClose}>
            <div className="flex flex-col gap-4 p-4">
                {b && (
                    <>
                        <PropertyPresentationCard
                            title={getPropertyTitle(b.property)}
                            address={b.property.localityName}
                            coverURL={
                                (b.property.images as ListingImage[])[0].uri
                            }
                            numberOfBedRooms={b.property.noOfRooms}
                            numberOfRooms={b.property.noOfRooms}
                            price={b.property.housingFee}
                            housingPeriod={b.property.housingPeriod}
                            surfaceArea={b.property.surfaceArea}
                            // @ts-expect-error image component
                            customImage={Image}
                        />

                        <hr className="h-[1px] w-full bg-gray" />

                        <dl className="flex flex-col items-start gap-3">
                            <dt className="text-gray">Date de visite :</dt>
                            <dd className="text-lg font-semibold">
                                {formatDateToFrenchDate(b.dateOfReservation)}
                            </dd>

                            <hr className="h-[1px] w-full bg-gray" />

                            <dt className="text-gray">Nom du visiteur : </dt>
                            <dd className="text-lg font-semibold">
                                {`${b.applicant.firstName} ${b.applicant.lastName}`}
                            </dd>

                            <hr className="h-[1px] w-full bg-gray" />

                            <dt className="text-gray">
                                Numéro de téléphone du visiteur :
                            </dt>
                            <dd className="text-lg font-semibold">
                                {b.applicant.phoneNumber}
                            </dd>
                        </dl>

                        <Button variant="hollow" onClick={onClose}>
                            Fermer
                        </Button>
                    </>
                )}
            </div>
        </ResponsiveModal>
    );
}
