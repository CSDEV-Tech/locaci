'use client';
import { Button } from '@locaci/ui/components/atoms/button';
import * as React from 'react';

// components
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';

// types
export type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
};

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title
}: DeleteConfirmationModalProps) {
    return (
        <ResponsiveModal isOpen={isOpen} title={title} onClose={onClose}>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
                <img
                    src="/delete_illustration.svg"
                    alt="Illustration suppression"
                    className="h-[165px] w-[240px]"
                />

                <h2 className="text-2xl font-extrabold">
                    Voulez-vous vraiment supprimer ce logement ?
                </h2>
                <section
                    aria-live="assertive"
                    className="flex flex-col gap-4 text-left text-dark">
                    <p>
                        En supprimant le logement&nbsp;
                        <em
                            className={`before:content-['"'] after:content-['"']`}>
                            {title}
                        </em>
                        , il n'apparaîtra plus sur votre tableau de bord.{' '}
                        <strong className="font-semibold text-danger">
                            Cette action est irréversible !
                        </strong>
                    </p>
                </section>

                <div className="flex items-center justify-between gap-14">
                    <Button variant="hollow" onClick={onClose}>
                        Annuler
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}>
                        Supprimer
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
