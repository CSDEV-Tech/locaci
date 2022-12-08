'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';

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
    return (
        <ResponsiveModal title="Terminé" onClose={onClose} isOpen={open}>
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
                        Nous avons envoyé un code de vérification à
                        l'adresse&nbsp;
                        <strong className="font-semibold">{email}</strong>.
                    </p>
                    <p>
                        Saisissez ce code pour vous connecter. Si vous ne le
                        trouvez pas, veuillez vérifier dans vos SPAMS.
                    </p>
                </section>

                <Button variant="hollow" onClick={onClose}>
                    J'ai compris.
                </Button>
            </div>
        </ResponsiveModal>
    );
}
