import * as React from 'react';

// components
import { Button } from '@locaci/ui';

// functions & others
import { useRouter } from 'next/router';
import useMediaQuery from '~/features/shared/hooks/use-media-query';
import { LazyBottomSheet } from '~/features/shared/components/lazy-bottom-sheet';
import { LazyModal } from '~/features/shared/components/lazy-modal';

// types
export type RequestAccessSuccessModalProps = {
    open: boolean;
};

export default function RequestAccessSuccessModal({
    open
}: RequestAccessSuccessModalProps) {
    const router = useRouter();

    const ModalContent = () => (
        <>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
                <img
                    src="/success_illustration.svg"
                    alt="Image de succès"
                    className="h-[165px] w-[240px]"
                />

                <h2 className="text-2xl font-extrabold">
                    Vous êtes dans la liste !
                </h2>
                <section
                    aria-live="assertive"
                    className="flex flex-col gap-4 text-left text-gray">
                    <p>
                        Nous allons vous contacter au plus tôt pour confirmer de
                        votre statut.
                    </p>

                    <p>
                        Après vérification, nous vous enverrons un lien pour
                        accéder à votre nouveau compte.
                    </p>

                    <p>
                        Sachez que la priorité de LOCACI c'est d'apporter
                        la&nbsp;
                        <strong>sécurité</strong> aussi bien aux bailleurs
                        qu'aux futurs locataires, cette procédure est nécessaire
                        pour assurer cette sécurité.
                    </p>
                </section>

                <Button
                    variant="primary"
                    onClick={() => {
                        router.push('/login');
                    }}>
                    Connectez-vous
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
                <LazyModal title="Merci" isOpen={open}>
                    <ModalContent />
                </LazyModal>
            )}
        </>
    );
}
