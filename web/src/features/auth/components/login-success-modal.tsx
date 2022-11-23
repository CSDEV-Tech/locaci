import * as React from 'react';
// components
import { Button } from '@locaci/ui';

// utils & functions
import useMediaQuery from '~/features/shared/hooks/use-media-query';
import { LazyBottomSheet } from '~/features/shared/components/lazy-bottom-sheet';
import { LazyModal } from '~/features/shared/components/lazy-modal';

export type LoginSuccessModalProps = {
    open: boolean;
    onClose: () => void;
    email?: string | null;
};

export default function LoginSuccessModal({
    email,
    onClose,
    open
}: LoginSuccessModalProps) {
    const ModalContent = () => (
        <>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
                <img
                    src="/success_illustration.svg"
                    alt="Image de succès"
                    className="h-[165px] w-[240px]"
                />

                <h2 className="text-2xl font-extrabold">
                    Vérifiez votre boîte email
                </h2>
                <section
                    aria-live="assertive"
                    className="flex flex-col gap-4 text-left text-gray">
                    <p>
                        Nous avons envoyé un email de vérification à
                        l'adresse&nbsp;
                        <strong className="font-bold">{email}</strong>.
                    </p>
                    <p>
                        Vous n'avez qu'à cliquer sur le lien dans cet email pour
                        vous connecter. Si vous ne le trouvez pas, veuillez
                        vérifier dans vos SPAMS.
                    </p>
                </section>

                <Button variant="hollow" onClick={onClose}>
                    Fermer ce message.
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
                <LazyModal title="Merci" isOpen={open} onClose={onClose}>
                    <ModalContent />
                </LazyModal>
            )}
        </>
    );
}
