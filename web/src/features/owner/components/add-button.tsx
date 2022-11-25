'use client';
import * as React from 'react';

// components
import { PlusCircleIcon } from '@locaci/ui/components/atoms/icons/plus-circle';
import { NextLinkButton } from '~/features/shared/components/next-link';

// utils
import { clsx } from '@locaci/ui/lib/functions';

export function AddButton() {
    return (
        <>
            <NextLinkButton
                href="/owner/properties/add"
                className="whitespace-nowrap"
                variant="secondary"
                aria-label="Ajouter une annonce"
                renderLeadingIcon={cls => (
                    <PlusCircleIcon className={clsx(cls)} weight={`bold`} />
                )}>
                <span className="hidden md:inline">Nouvelle annonce</span>
            </NextLinkButton>
        </>
    );
}
