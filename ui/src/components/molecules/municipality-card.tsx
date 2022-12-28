import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Card } from '../atoms/card';
import { ArrowRightIcon } from '../atoms/icons/arrow-right';
import { Link, LinkProps } from '../atoms/link';
import type { CustomImageComponentType } from './dashboard-property-card';

export type MunicipalityCardProps = {
    customImage?: CustomImageComponentType;
    customLink?: LinkProps['Custom'];
    className?: string;
    coverURL: string;
    name: string;
    href: string;
    noOfListings: number;
};

export function MunicipalityCard({
    customImage,
    customLink,
    className,
    name,
    href,
    coverURL,
    noOfListings
}: MunicipalityCardProps) {
    const Img = customImage ?? 'img';
    return (
        <Card
            className={clsx(
                className,
                'inline-flex items-center gap-4',
                'relative w-full bg-white p-4',
                'group'
            )}
            animated>
            <div className="h-[64px] w-[64px] flex-shrink-0">
                <Img
                    width={64}
                    height={64}
                    alt={name}
                    src={coverURL}
                    className="h-full w-full rounded-lg object-cover object-center"
                />
            </div>

            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3>
                        <Link
                            Custom={customLink}
                            href={href}
                            className={`text-xl font-semibold text-dark after:absolute after:inset-0 focus:outline-none`}>
                            {name}
                        </Link>
                    </h3>
                    <p className="text-gray">
                        {noOfListings} logement{noOfListings !== 1 && 's'}
                    </p>
                </div>

                <div className="flex h-full items-center">
                    <ArrowRightIcon
                        weight="bold"
                        className={`hidden h-5 w-5 text-primary group-focus-within:block group-hover:block group-active:block`}
                    />
                </div>
            </div>
        </Card>
    );
}
