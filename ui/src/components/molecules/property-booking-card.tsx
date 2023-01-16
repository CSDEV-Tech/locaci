import * as React from 'react';
import {
    clsx,
    formatDateToFrenchDate,
    formatNumberToFCFA
} from '../../lib/functions';
import { Card } from '../atoms/card';
import { CalendarBlankIcon } from '../atoms/icons/calendar-blank';
import { MapPinIcon } from '../atoms/icons/map-pin';

import { Link, LinkProps } from '../atoms/link';
import type { CustomImageComponentType } from './dashboard-property-card';

export type PropertyBookingCardProps = {
    title: string;
    surfaceArea: number;
    numberOfRooms: number;
    numberOfBedRooms: number;
    coverURL: string;
    address: string;
    price: number;
    customImage?: CustomImageComponentType;
    className?: string;
    housingPeriod?: number;
    dateOfReservation: Date;
    href: string;
    customLink?: LinkProps['Custom'];
};

function getHousingPeriodLabel(
    housingPeriod: PropertyBookingCardProps['housingPeriod']
) {
    switch (housingPeriod) {
        case 1:
            return 'jour';
        case 7:
            return 'semaine';
        default:
            return 'mois';
    }
}

export function PropertyBookingCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customImage,
    price,
    housingPeriod = 30,
    className,
    numberOfBedRooms,
    dateOfReservation,
    customLink,
    href
}: PropertyBookingCardProps) {
    const Img = customImage ?? 'img';

    return (
        <Card
            className={clsx(
                className,
                'inline-flex flex-col',
                'relative w-full',
                'border !shadow-sm md:flex-row'
            )}>
            <div
                className={clsx(
                    'flex flex-shrink-0 items-center justify-center rounded-t-lg bg-gray/20',
                    'h-[120px] w-full',
                    'md:h-auto md:w-48 md:rounded-t-none md:rounded-l-lg'
                )}>
                <Img
                    width={370}
                    height={120}
                    alt={title}
                    src={coverURL}
                    className={clsx(
                        'h-full w-full rounded-t-lg object-cover object-center',
                        'md:absolute md:top-0 md:bottom-0',
                        'md:rounded-t-none md:rounded-l-lg',
                        'md:w-48'
                    )}
                />
            </div>

            <div className="flex h-full w-full flex-col items-start justify-between p-4">
                <h2
                    className={clsx(
                        `text-lg font-semibold text-dark md:inline`
                    )}>
                    <Link
                        dynamic
                        href={href}
                        className={`after:absolute after:inset-0`}>
                        {title}&nbsp;
                    </Link>
                </h2>

                <div
                    className={clsx(
                        `inline-flex items-center rounded-md bg-secondary py-1 px-2 font-semibold text-white`
                    )}>
                    <CalendarBlankIcon
                        aria-label="Date de réservation :"
                        className="h-6 w-6 flex-shrink-0"
                    />
                    &nbsp;
                    <small>
                        <time dateTime={dateOfReservation.toISOString()}>
                            {formatDateToFrenchDate(dateOfReservation)}
                        </time>
                    </small>
                </div>

                <div className="mt-2 flex w-full flex-col gap-2">
                    <div
                        className={clsx(
                            `flex w-full max-w-full items-center text-gray-500`
                        )}>
                        <MapPinIcon
                            aria-label="Addresse :"
                            className="h-6 w-6 flex-shrink-0"
                        />
                        &nbsp;
                        <small>{address}</small>
                    </div>

                    <div className="flex items-center text-dark">
                        {numberOfRooms} pièce{numberOfRooms > 1 ? 's' : ''}
                        &nbsp;&middot;&nbsp;
                        {numberOfBedRooms} chambre
                        {numberOfBedRooms > 1 ? 's' : ''}&nbsp;&middot;&nbsp;
                        {surfaceArea} m<sup>2</sup>
                    </div>
                </div>

                <div className="mt-4 flex items-center">
                    <div>
                        <span className="text-base font-semibold text-dark md:text-lg">
                            {formatNumberToFCFA(price)}&nbsp;
                        </span>
                        <small className="font-regular text-gray">
                            /{getHousingPeriodLabel(housingPeriod)}
                        </small>
                    </div>
                </div>
            </div>
        </Card>
    );
}
