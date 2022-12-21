import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';
import { Card } from '../atoms/card';
import { BedIcon } from '../atoms/icons/bed';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { RulerIcon } from '../atoms/icons/ruler';
import { Link, LinkProps } from '../atoms/link';
import type { CustomImageComponentType } from './dashboard-property-card';

export type PropertyCardProps = {
    href: string;
    title: string;
    surfaceArea: number;
    numberOfRooms: number;
    coverURL: string;
    address: string;
    price: number;
    customLink?: LinkProps['Custom'];
    customImage?: CustomImageComponentType;
    className?: string;
    housingPeriod?: number;
};

function getHousingPeriodLabel(
    housingPeriod: PropertyCardProps['housingPeriod']
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

export function PropertyCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    customImage,
    price,
    housingPeriod = 30,
    className
}: PropertyCardProps) {
    const Img = customImage ?? 'img';

    return (
        <Card
            className={clsx(
                className,
                'inline-flex flex-col',
                'relative w-full max-w-[345px]'
            )}
            animated>
            <div className="flex h-[175px] w-full max-w-[345px] flex-shrink-0 items-center justify-center rounded-t-lg bg-gray/20">
                <Img
                    width={345}
                    height={175}
                    alt={title}
                    src={coverURL}
                    className="h-full w-full rounded-t-lg object-cover object-center"
                />
            </div>

            <div className="flex h-full flex-col p-4">
                <Link
                    href={href}
                    Custom={customLink}
                    className={clsx(
                        `text-lg font-semibold text-dark`,
                        `after:absolute after:inset-0`,
                        `focus:outline-none`
                    )}>
                    {title}&nbsp;
                </Link>

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

                    <div className="flex items-center text-gray">
                        <BedIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <small>
                            {numberOfRooms} pièce{numberOfRooms !== 1 && 's'}
                        </small>
                    </div>

                    <div className="flex items-center text-gray">
                        <RulerIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <small>
                            {surfaceArea} m<sup>2</sup>
                        </small>
                    </div>
                </div>

                <div className="mt-4 flex items-center ">
                    <h4 className="">
                        <span className="text-lg font-semibold text-dark">
                            {formatNumberToFCFA(price)}&nbsp;
                        </span>
                        <small className="font-regular text-gray">
                            /{getHousingPeriodLabel(housingPeriod)}
                        </small>
                    </h4>
                </div>
            </div>
        </Card>
    );
}
