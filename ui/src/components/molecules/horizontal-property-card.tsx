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
    actions = []
}: HorizontalPropertyCardProps) {
    const Img = CustomImage ?? 'img';

    return (
        <>
            <Card
                className={clsx(
                    className,
                    'inline-flex flex-row gap-4 pr-4',
                    'relative h-32 w-full'
                )}>
                <div className="flex h-full w-48 flex-shrink-0 items-center justify-center rounded-l-lg bg-gray/40">
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
                        href={href}
                        Custom={customLink}
                        className={clsx(
                            `whitespace-nowrap text-xl font-semibold`,
                            `after:absolute after:inset-0`,
                            `min-w-0 flex-shrink overflow-hidden text-ellipsis`
                        )}>
                        {title}&nbsp;
                        {isDraft && (
                            <span className="text-base text-gray">
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
                        <div className="min-w-0 flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                            {Boolean(address?.trim()) ? address : 'Non défini'}
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-4">
                        <div className="flex items-center text-dark">
                            <BedIcon className="h-4 w-4 flex-shrink-0" />
                            &nbsp;
                            <span className="text-sm">
                                {numberOfRooms} pièce
                                {numberOfRooms !== 1 && 's'}
                            </span>
                        </div>

                        <div className="flex items-center text-dark">
                            <RulerIcon className="h-4 w-4 flex-shrink-0" />
                            &nbsp;
                            <span className="text-sm">
                                {surfaceArea} m<sup>2</sup>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 justify-end py-4">
                    <Dropdown
                        customLink={customLink}
                        align="right"
                        className="z-40"
                        button={() => (
                            <Button
                                square
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
