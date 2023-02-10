import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';
import { Card } from '../atoms/card';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { Link, LinkProps } from '../atoms/link';

import type { CustomImageComponentType } from './dashboard-property-card';
import { ImageSlider } from './image-slider';

export type PropertySearchCardProps = {
    title: string;
    surfaceArea: number;
    numberOfRooms: number;
    numberOfBedRooms: number;
    imagesURL: string[];
    address: string;
    price: number;
    customImage?: CustomImageComponentType;
    className?: string;
    housingPeriod?: number;
    href: string;
    size?: 'small' | 'medium';
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

function getHousingPeriodLabel(
    housingPeriod: PropertySearchCardProps['housingPeriod']
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

export function PropertySearchCard({
    imagesURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customImage,
    price,
    housingPeriod,
    className,
    numberOfBedRooms,
    href,
    onMouseEnter,
    onMouseLeave,
    size = 'medium'
}: PropertySearchCardProps) {
    return (
        <Card
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={clsx(
                className,
                'group inline-flex flex-col',
                'relative w-full',
                'border !shadow-sm'
            )}>
            <div
                className={clsx(
                    'flex flex-shrink-0 items-center justify-center bg-gray/20',
                    'w-full rounded-t-lg',
                    {
                        'h-[150px]': size === 'small',
                        'h-[200px]': size === 'medium'
                    }
                )}>
                <ImageSlider customImage={customImage} imageURIs={imagesURL} />
            </div>

            <div className="flex h-full flex-col justify-between p-4">
                <Link
                    href={href}
                    target="_blank"
                    className={clsx(
                        `text-dark`,
                        `after:absolute after:inset-0`,
                        `focus:outline-none`,
                        {
                            'text-sm': size === 'small',
                            'text-lg font-semibold': size !== 'small'
                        }
                    )}>
                    {title}&nbsp;
                </Link>

                <div className="mt-2 flex w-full flex-col gap-2">
                    <div
                        className={clsx(
                            `flex w-full max-w-full items-center text-gray`,
                            {
                                hidden: size === 'small'
                            }
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

                    <div
                        className={clsx(
                            'flex flex-wrap items-start text-dark',
                            {
                                'font-medium': size === 'small'
                            }
                        )}>
                        <span>
                            {numberOfRooms} pièce{numberOfRooms > 1 ? 's' : ''}
                        </span>
                        &nbsp;&middot;&nbsp;
                        <span>
                            {numberOfBedRooms} chambre
                            {numberOfBedRooms > 1 ? 's' : ''}
                            &nbsp;&middot;&nbsp;
                        </span>
                        <span>
                            {surfaceArea} m<sup>2</sup>
                        </span>
                    </div>
                </div>

                <div
                    className={clsx('flex items-center', {
                        'order-first': size === 'small',
                        'mt-4': size !== 'small'
                    })}>
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
