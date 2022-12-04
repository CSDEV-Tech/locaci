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

export type CustomImageProps = {
    className?: string | null;
    src?: string;
    alt: string;
    width: number;
    height: number;
};
export type CustomImageComponentType = React.ComponentType<CustomImageProps>;

export type PresentationListingCardProps = {
    href: string;
    title: string;
    surfaceArea: number;
    numberOfRooms: number;
    coverURL?: string;
    address?: string;
    actionBar?: React.ReactNode;
    customLink?: LinkProps['Custom'];
    customImage?: CustomImageComponentType;
    className?: string;
    isDraft?: boolean;
    direction?: 'vertical' | 'horizontal';
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
    customImage: CustomImage,
    className,
    isDraft = false
}: PresentationListingCardProps) {
    const Img = CustomImage ?? 'img';

    return (
        <Card
            animated
            className={clsx(
                className,
                'inline-flex flex-col',
                'relative w-full max-w-[345px]'
            )}>
            {isDraft && (
                <>
                    <div
                        className={clsx(
                            'absolute left-0 right-0 rounded-t-lg bg-dark opacity-60',
                            'h-[175px] w-full max-w-[345px]',
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
                    width={345}
                    height={175}
                    alt={title}
                    src={coverURL}
                    className="h-[175px] w-full max-w-[345px] rounded-t-lg object-cover object-center"
                />
            ) : (
                <div className="flex h-[175px] w-full max-w-[345px] flex-shrink-0 items-center justify-center rounded-t-md bg-gray/20">
                    <ImageIcon className="h-16 w-16 text-gray" />
                </div>
            )}
            <div className="flex h-full flex-col justify-between gap-4 p-4">
                <Link
                    href={href}
                    Custom={customLink}
                    className={`text-xl font-semibold after:absolute after:inset-0`}>
                    {title}
                </Link>

                <div className="flex w-full flex-col gap-2">
                    <div
                        className={clsx(`flex w-full max-w-full items-center`, {
                            'text-gray':
                                !address || address?.trim().length === 0,
                            'text-dark': address?.trim().length !== 0
                        })}>
                        <MapPinIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <span className="text-sm">
                            {Boolean(address?.trim()) ? address : 'Non défini'}
                        </span>
                    </div>

                    <div className="flex items-center text-dark">
                        <BedIcon className="h-6 w-6 flex-shrink-0" />
                        &nbsp;
                        <span className="text-sm">
                            {numberOfRooms} pièce{numberOfRooms !== 1 && 's'}
                        </span>
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
