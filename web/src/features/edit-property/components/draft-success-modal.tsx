import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { LazyBottomSheet } from '~/features/shared/components/lazy-bottom-sheet';
import { LazyModal } from '~/features/shared/components/lazy-modal';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import useMediaQuery from '~/features/shared/hooks/use-media-query';

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
    const ModalContent = () => (
        <>
            <div
                className={`flex flex-col items-center gap-6 py-5 md:m-auto md:w-[450px]`}>
                <img
                    src="/success_illustration.svg"
                    alt="Image de succès"
                    className="h-[165px] w-[240px]"
                />

                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Votre logement a été créé
                </h1>

                <h2 className="text-center text-lg text-gray">
                    L'annonce de votre logement a été mise en ligne, vous pouvez
                    inspecter le résultat :&nbsp;
                    <NextLink
                        href={`/properties/${propertyUid}`}
                        className={`underline`}>
                        En cliquant sur ce lien
                    </NextLink>
                </h2>

                <Button variant={`dark`} onClick={onClose}>
                    Revenir au tableau de bord
                </Button>
            </div>
        </>
    );

    const canShowModal = useMediaQuery(`(min-width: 768px)`);
    const canShowBottomSheet = useMediaQuery(`(max-width: 767px)`);
    return (
        <>
            {canShowBottomSheet && (
                <LazyBottomSheet
                    open={open}
                    expandOnContentDrag
                    onDismiss={onClose}
                    defaultSnap={({ minHeight }) => minHeight}
                    snapPoints={({ maxHeight, minHeight }) => [
                        minHeight,
                        maxHeight * 0.95
                    ]}
                    className={`md:hidden`}>
                    <ModalContent />
                </LazyBottomSheet>
            )}

            {canShowModal && (
                <LazyModal title="Succès" isOpen={open} onClose={onClose}>
                    <ModalContent />
                </LazyModal>
            )}
        </>
    );
}
