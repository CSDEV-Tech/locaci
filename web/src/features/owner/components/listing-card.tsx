'use client';
import * as React from 'react';

// components
import { PropertyCard } from '@locaci/ui/components/molecules/property-card';
import { HorizontalPropertyCard } from '@locaci/ui/components/molecules/horizontal-property-card';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { Button } from '@locaci/ui/components/atoms/button';
import { TrashIcon } from '@locaci/ui/components/atoms/icons/trash';
import Image from 'next/image';
import { Copy, PencilSimple, TrashSimple } from 'phosphor-react';

// types
import type { PropertyCardProps } from '@locaci/ui/components/molecules/property-card';
import type { DropdownItem } from '@locaci/ui/components/molecules/dropdown';
import { clsx } from '@locaci/ui/lib/functions';
export type ListingCardProps = Omit<
    PropertyCardProps,
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
    const actions: DropdownItem[] = [
        {
            href,
            text: 'Modifier',
            Icon: props => (
                <PencilSimple className={props.className} weight="bold" />
            )
        }
    ];

    // Only non draft can be duplicated
    if (!isDraft) {
        actions.push({
            onClick() {
                console.log('Duppliquer ?');
            },
            text: 'Dupliquer',
            Icon: props => <Copy className={props.className} weight="bold" />
        });
    }

    // we should add delete only at the end
    actions.push({
        onClick() {
            console.log('Suppression ?');
        },
        text: 'Supprimer',
        Icon: props => (
            <TrashSimple className={clsx(props.className)} weight="fill" />
        ),
        clsx: ({ active }) => (active ? 'text-white' : 'text-danger')
    });

    return (
        <>
            <PropertyCard
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
                className="h-full w-full lg:hidden"
            />

            <HorizontalPropertyCard
                {...props}
                className={`hidden lg:flex`}
                isDraft={isDraft}
                customLink={NextLink}
                actions={actions}
                href={href}
                title={title.trim()}
            />
        </>
    );
}
