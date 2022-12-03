import * as React from 'react';
import { Link } from '../atoms/link';
import type { LinkProps } from '../atoms/link';
import { ImageIcon } from '../atoms/icons/image';
import { clsx } from '../../lib/functions';
import { BedIcon } from '../atoms/icons/bed';
import { RulerIcon } from '../atoms/icons/ruler';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { Card } from '../atoms/card';
import { Tag } from '../atoms/tag';

export type CustomImageComponentType =
    | React.ComponentType<React.HTMLAttributes<HTMLImageElement>>
    | React.ForwardRefExoticComponent<React.RefAttributes<HTMLImageElement>>;

export type PresentationListingCardProps = {
    href: string;
    title: string;
    surfaceArea: number;
    numberOfRooms: number;
    coverURL?: string;
    address?: string;
    actionBar?: React.ReactNode;
    customLink?: LinkProps['Custom'];
    CustomImage?: CustomImageComponentType;
    className?: string;
    isDraft?: boolean;
};

export function PresentationListingCard({
    coverURL,
    actionBar,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    CustomImage,
    className,
    isDraft = false
}: PresentationListingCardProps) {
    const Img = CustomImage ?? 'img';

    return (
        <Card
            animated
            className={clsx(className, 'inline-flex flex-col', 'relative')}>
            {isDraft && (
                <>
                    <div
                        className={clsx(
                            'absolute left-0 right-0 rounded-t-lg bg-dark opacity-60',
                            'h-[175px] w-[345px]',
                            {
                                'opactity-30': !coverURL
                            }
                        )}
                    />
                    <Tag className="absolute top-4 right-4" variant="hollow">
                        Brouillon
                    </Tag>
                </>
            )}

            {coverURL ? (
                <Img
                    src={coverURL}
                    className="h-[175px] w-[345px] rounded-t-lg object-cover object-center"
                />
            ) : (
                <div className="flex h-[175px] w-[345px] items-center justify-center rounded-t-md bg-gray/20">
                    <ImageIcon className="h-16 w-16 text-gray" />
                </div>
            )}
            <div className="flex flex-col gap-4 p-4">
                <Link
                    href={href}
                    Custom={customLink}
                    className={`text-xl font-semibold after:absolute after:inset-0`}>
                    {title}
                </Link>

                <div className="flex flex-col gap-2">
                    <div
                        className={clsx(`flex items-center`, {
                            'text-gray': !Boolean(address),
                            'text-dark': Boolean(address)
                        })}>
                        <MapPinIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <span className="text-sm">
                            {address ?? 'Non défini'}
                        </span>
                    </div>

                    <div className="flex items-center text-dark">
                        <BedIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <span className="text-sm">{numberOfRooms} pièces</span>
                    </div>

                    <div className="flex items-center text-dark">
                        <RulerIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <span className="text-sm">
                            {surfaceArea} m<sup>2</sup>
                        </span>
                    </div>
                </div>

                <div className="relative z-20">{actionBar}</div>
            </div>
        </Card>
    );
}
