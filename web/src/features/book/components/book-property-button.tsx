'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';

// utils
import { BookPropertyModal } from './book-property-modal';
import { useRouter, useSearchParams } from 'next/navigation';

// types
export type BookPropertyButtonProps = {
    propertyUid: string;
};

export function BookPropertyButton({ propertyUid }: BookPropertyButtonProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [_, startTransition] = React.useTransition();

    const [isBookModalOpen, setIsModalOpen] = React.useState(
        searchParams.get('booking_modal_open') === 'true'
    );

    return (
        <>
            <Button
                variant="primary"
                onClick={() => {
                    setIsModalOpen(true);
                    startTransition(() =>
                        router.replace(
                            `/properties/${propertyUid}?booking_modal_open=true`
                        )
                    );
                }}>
                Réserver
            </Button>

            <BookPropertyModal
                open={isBookModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    startTransition(() =>
                        router.replace(`/properties/${propertyUid}`)
                    );
                }}
                propertyUid={propertyUid}
            />
        </>
    );
}
