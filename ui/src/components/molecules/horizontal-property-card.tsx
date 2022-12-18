import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Button } from '../atoms/button';
import { Card } from '../atoms/card';
import { BedIcon } from '../atoms/icons/bed';
import { HorizontalDotsIcon } from '../atoms/icons/horizontal-dots';
import { ImageIcon } from '../atoms/icons/image';
import { MapPinIcon } from '../atoms/icons/map-pin';
import { RulerIcon } from '../atoms/icons/ruler';
import { Link, type LinkProps } from '../atoms/link';
import { Dropdown, DropdownItem } from './dropdown';

export type CustomImageProps = {
    className?: string | null;
    src?: string;
    alt: string;
    width: number;
    height: number;
};
export type CustomImageComponentType = React.ComponentType<CustomImageProps>;

export type HorizontalPropertyCardProps = {
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
    actions: DropdownItem[];
    disabled?: boolean;
};

export function HorizontalPropertyCard({
    coverURL,
    address,
    surfaceArea,
    numberOfRooms,
    title,
    customLink,
    href,
    customImage: CustomImage,
    className,
    isDraft = false,
    actions = [],
    disabled = false
}: HorizontalPropertyCardProps) {
    const Img = CustomImage ?? 'img';

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
