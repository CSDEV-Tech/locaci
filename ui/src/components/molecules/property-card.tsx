import * as React from 'react';
import { Link } from '../atoms/link';
import { ImageIcon } from '../atoms/icons/image';
import { clsx } from '../../lib/functions';
import { BedIcon } from '../atoms/icons/bed';
import { RulerIcon } from '../atoms/icons/ruler';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { Card } from '../atoms/card';
import { Button } from '../atoms/button';
import { CaretDownIcon } from '../atoms/icons/caret-down';
import { CaretUpIcon } from '../atoms/icons/caret-up';
import { Dropdown } from './dropdown';

import type { LinkProps } from '../atoms/link';
import type { DropdownItem } from './dropdown';
import { Tag } from '../atoms/tag';
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
    customLink?: LinkProps['Custom'];
    customImage?: CustomImageComponentType;
    className?: string;
    isDraft?: boolean;
    disabled?: boolean;
    actions: DropdownItem[];
    isVisible?: boolean;
};

export function PropertyCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    customImage: CustomImage,
    className,
    isVisible = false,
    isDraft = false,
    disabled = false,
    actions = []
}: PropertyCardProps) {
    const Img = CustomImage ?? 'img';

    return (
        <Card
            className={clsx(
                className,
                'inline-flex flex-col',
                'relative w-full max-w-[345px]',
                {
                    'animate-pulse': disabled
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
                </>
            )}

            <Dropdown
                customLink={customLink}
                align="right"
                className="!absolute top-4 right-4"
                itemsClassName="z-40"
                button={({ open }) => (
                    <Button
                        square
                        disabled={disabled}
                        variant={`dark`}
                        className={clsx('relative z-30', {
                            'cursor-not-allowed': disabled
                        })}
                        renderTrailingIcon={cls =>
                            !open ? (
                                <CaretDownIcon className={cls} />
                            ) : (
                                <CaretUpIcon className={cls} />
                            )
                        }>
                        Menu
                    </Button>
                )}
                items={actions}
            />

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
            <div className="flex h-full flex-col gap-4 p-4">
                <Link
                    disabled={disabled}
                    href={href}
                    Custom={customLink}
                    className={clsx(`text-xl font-semibold`, {
                        'pointer-events-none': disabled,
                        'hover:underline': !disabled,
                        'text-gray': isDraft,
                        'text-dark': !isDraft
                    })}>
                    {title}&nbsp;
                    {isDraft && (
                        <span className="text-sm text-gray md:text-base">
                            (Brouillon)
                        </span>
                    )}
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
                    {!isDraft && (
                        <div className="flex items-center">
                            <Tag
                                variant={
                                    isVisible
                                        ? 'secondary-light'
                                        : 'accent-primary'
                                }>
                                {isVisible ? 'Actif' : 'Inactif'}
                            </Tag>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
