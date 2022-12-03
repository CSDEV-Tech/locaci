'use client';
import * as React from 'react';

// components
import { PresentationListingCard } from '@locaci/ui/components/molecules/presentation-listing-card';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { Button } from '@locaci/ui/components/atoms/button';
import { TrashIcon } from '@locaci/ui/components/atoms/icons/trash';
import Image from 'next/image';

// types
import type { PresentationListingCardProps } from '@locaci/ui/components/molecules/presentation-listing-card';

export type ListingCardProps = Omit<
    PresentationListingCardProps,
    'customLink' | 'customImage' | 'actionBar'
> & {
    id: string;
};

export function ListingCard({
    id,
    isDraft,
    href,
    title,
    ...props
}: ListingCardProps) {
    return (
        <>
            <PresentationListingCard
                isDraft={isDraft}
                href={href}
                title={title.trim()}
                customLink={NextLink}
                // @ts-ignore
                customImage={Image}
                actionBar={
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <NextLinkButton href={href} variant="dark">
                                Modifier
                            </NextLinkButton>
                            {!isDraft && <Button>Dupliquer</Button>}
                        </div>
                        <Button
                            square
                            variant="danger"
                            aria-label="Archiver"
                            renderLeadingIcon={cls => (
                                <TrashIcon className={cls} />
                            )}
                        />
                    </div>
                }
                {...props}
            />
        </>
    );
}
