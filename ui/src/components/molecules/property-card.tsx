import * as React from 'react';
import { Link } from '../atoms/link';
import { ImageIcon } from '../atoms/icons/image';
import { clsx } from '../../lib/functions';
import { BedIcon } from '../atoms/icons/bed';
import { RulerIcon } from '../atoms/icons/ruler';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { Card } from '../atoms/card';
import { Tag } from '../atoms/tag';

import type { LinkProps } from '../atoms/link';
export type CustomImageProps = {
    className?: string | null;
    src?: string;
    alt: string;
    width: number;
    height: number;
};
export type CustomImageComponentType = React.ComponentType<CustomImageProps>;

export type PropertyCardProps = {
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
    disabled?: boolean;
};

export function PropertyCard({
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
    isDraft = false,
    disabled = false
}: PropertyCardProps) {
    const Img = CustomImage ?? 'img';

    return (
        <Card
            animated={!disabled}
            className={clsx(
                className,
                'inline-flex flex-col',
                'relative w-full max-w-[345px]',
                {
                    'animate-pulse cursor-not-allowed': disabled
                }
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

            <div className="flex h-[175px] w-full max-w-[345px] flex-shrink-0 items-center justify-center rounded-t-lg bg-gray/20">
                {coverURL ? (
                    <Img
                        width={345}
                        height={175}
                        alt={title}
                        src={coverURL}
                        className="h-full w-full rounded-t-lg object-cover object-center"
                    />
                ) : (
                    <ImageIcon className="h-16 w-16 text-gray" />
                )}
            </div>
            <div className="flex h-full flex-col justify-between gap-4 p-4">
                <Link
                    disabled={disabled}
                    href={href}
                    Custom={customLink}
                    className={clsx(`text-xl font-semibold`, {
                        'after:absolute after:inset-0': !disabled,
                        'pointer-events-none': disabled
                    })}>
                    {title}
                </Link>

                <div className="flex w-full flex-col gap-2">
                    <div
                        className={clsx(`flex w-full max-w-full items-center`, {
                            'text-gray':
                                !address || address?.trim().length === 0,
                            'text-dark': address?.trim().length !== 0
                        })}>
                        <MapPinIcon
                            aria-label="Addresse :"
                            className="h-6 w-6 flex-shrink-0"
                        />
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

                {actionBar && <div className="relative z-20">{actionBar}</div>}
            </div>
        </Card>
    );
}
