'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';

// type
export type DraftSuccessModalProps = {
    open: boolean;
    onClose: () => void;
    propertyUid: string;
};

export function DraftSuccessModal({
    onClose,
    open,
    propertyUid
}: DraftSuccessModalProps) {
    return (
        <>
            <ResponsiveModal title="Succès" isOpen={open} onClose={onClose}>
                <div
                    className={`flex flex-col items-center gap-6 py-10 px-6 md:m-auto md:w-[450px]`}>
                    <img
                        src="/success_illustration.svg"
                        alt="Image de succès"
                        className="h-[165px] w-[240px]"
                    />

                    <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                        Votre logement a été créé
                    </h1>

                    <h2 className="text-center text-lg text-gray">
                        Votre logement a été mise en ligne, vous pouvez voir le
                        résultat&nbsp;
                        <NextLink
                            href={`/properties/${propertyUid}`}
                            className={`font-semibold text-secondary underline`}>
                            En cliquant sur ce lien
                        </NextLink>
                    </h2>

                    <Button variant={`dark`} onClick={onClose}>
                        Revenir au tableau de bord
                    </Button>
                </div>
            </ResponsiveModal>
        </>
    );
}
