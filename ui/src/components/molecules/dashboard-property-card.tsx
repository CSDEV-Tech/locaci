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
import { HorizontalDotsIcon } from '../atoms/icons/horizontal-dots';
export type CustomImageProps = {
    className?: string | null;
    src?: string;
    alt: string;
    width: number;
    height: number;
};
export type CustomImageComponentType = React.ComponentType<CustomImageProps>;

export type DashboardPropertyCardProps = {
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
    isActiveForListing?: boolean;
};

export function DashboardPropertyCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    customImage,
    className,
    isActiveForListing = false,
    isDraft = false,
    disabled = false,
    actions = []
}: DashboardPropertyCardProps) {
    const Img = customImage ?? 'img';

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
                                    isActiveForListing
                                        ? 'secondary-light'
                                        : 'accent-primary'
                                }>
                                {isActiveForListing ? 'Actif' : 'Inactif'}
                            </Tag>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function HorizontalDashboardPropertyCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    customImage,
    className,
    isActiveForListing = false,
    isDraft = false,
    actions = [],
    disabled = false
}: DashboardPropertyCardProps) {
    const Img = customImage ?? 'img';

    return (
        <>
            <Card
                className={clsx(
                    className,
                    'inline-flex flex-row gap-4 pr-4',
                    'relative h-32 w-full',
                    {
                        'animate-pulse cursor-not-allowed': disabled
                    }
                )}>
                <div className="flex h-full w-24 flex-shrink-0 items-center justify-center rounded-l-lg bg-gray/40 md:w-48">
                    {coverURL ? (
                        <Img
                            width={200}
                            height={150}
                            alt={title}
                            src={coverURL}
                            className="h-full w-full rounded-l-lg object-cover object-center"
                        />
                    ) : (
                        <ImageIcon className="h-16 w-16 text-gray" />
                    )}
                </div>

                <div className="inline-flex min-w-0 flex-grow flex-col gap-2 py-2">
                    <div className="flex items-center gap-4">
                        <Link
                            disabled={disabled}
                            href={href}
                            Custom={customLink}
                            className={clsx(
                                `text-sm font-semibold`,
                                `min-w-0 flex-shrink overflow-hidden text-ellipsis`,
                                `hover:underline`,
                                `md:whitespace-nowrap md:text-xl`,
                                {
                                    'pointer-events-none': disabled,
                                    'text-gray': isDraft,
                                    'text-dark': !isDraft
                                }
                            )}>
                            {title}&nbsp;
                            {isDraft && (
                                <span className="text-sm text-gray md:text-base">
                                    (Brouillon)
                                </span>
                            )}
                        </Link>
                        {!isDraft && (
                            <div className="flex items-center">
                                <Tag
                                    variant={
                                        isActiveForListing
                                            ? 'secondary-light'
                                            : 'accent-primary'
                                    }>
                                    {isActiveForListing ? 'Actif' : 'Inactif'}
                                </Tag>
                            </div>
                        )}
                    </div>

                    <div className={clsx(`flex items-center`, `text-gray`)}>
                        <MapPinIcon
                            aria-label="Addresse :"
                            className="h-4 w-4 flex-shrink-0"
                        />
                        &nbsp;
                        <div
                            className={clsx(
                                'min-w-0 flex-shrink text-xs',
                                'overflow-hidden text-ellipsis',
                                'whitespace-nowrap md:text-sm'
                            )}>
                            {Boolean(address?.trim()) ? address : 'Non défini'}
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-4">
                        <div className="flex items-center text-dark">
                            <BedIcon className="h-4 w-4 flex-shrink-0" />
                            &nbsp;
                            <span className="text-xs md:text-sm">
                                {numberOfRooms} pièce
                                {numberOfRooms !== 1 && 's'}
                            </span>
                        </div>

                        <div className="flex items-center text-dark">
                            <RulerIcon className="h-4 w-4 flex-shrink-0" />
                            &nbsp;
                            <span className="text-xs md:text-sm">
                                {surfaceArea} m<sup>2</sup>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 justify-end py-4">
                    <Dropdown
                        customLink={customLink}
                        align="right"
                        itemsClassName="z-40"
                        button={() => (
                            <Button
                                disabled={disabled}
                                square
                                className="relative z-30"
                                renderLeadingIcon={cls => (
                                    <HorizontalDotsIcon className={cls} />
                                )}
                            />
                        )}
                        items={actions}
                    />
                </div>
            </Card>
        </>
    );
}
