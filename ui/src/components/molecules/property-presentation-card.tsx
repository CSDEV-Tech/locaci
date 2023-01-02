import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';
import { Card } from '../atoms/card';
import { BedIcon } from '../atoms/icons/bed';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { RulerIcon } from '../atoms/icons/ruler';
import { Link, LinkProps } from '../atoms/link';
import type { CustomImageComponentType } from './dashboard-property-card';

export type PropertyPresentationCardProps = {
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
};

function getHousingPeriodLabel(
    housingPeriod: PropertyPresentationCardProps['housingPeriod']
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

export function PropertyPresentationCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customImage,
    price,
    housingPeriod = 30,
    className,
    numberOfBedRooms
}: PropertyPresentationCardProps) {
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

            <div className="flex h-full flex-col justify-between p-4">
                <h2 className={clsx(`text-lg font-semibold text-dark`)}>
                    {title}&nbsp;
                </h2>

                <div className="mt-2 flex w-full flex-col gap-2">
                    <div
                        className={clsx(
                            `flex w-full max-w-full items-center text-gray`
                        )}>
                        <MapPinIcon
                            aria-label="Addresse :"
                            className="h-6 w-6 flex-shrink-0"
                        />
                        &nbsp;
                        <small>
                            {Boolean(address?.trim()) ? address : 'Non défini'}
                        </small>
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
                        <span className="text-lg font-semibold text-dark">
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
