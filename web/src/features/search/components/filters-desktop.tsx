'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { SliderIcon } from '@locaci/ui/components/atoms/icons/slider';
import { LazyModal } from '~/features/shared/components/lazy-modal';
import { FiltersForm } from './filters-form';

// utils
import useMediaQuery from '~/features/shared/hooks/use-media-query';

// types
export type FiltersDesktop = {
    defaultMunicipalities: { label: string; value: string }[];
};

export function FiltersDesktop({ defaultMunicipalities }: FiltersDesktop) {
    const canShowModal = useMediaQuery(`(min-width: 768px)`);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button
                variant="primary"
                onClick={() => setIsOpen(true)}
                renderLeadingIcon={cls => <SliderIcon className={cls} />}>
                Modifier les filtres
            </Button>

            {canShowModal && (
                <LazyModal
                    title={'Modifier les filtres'}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}>
                    <FiltersForm
                        onSubmit={() => setIsOpen(false)}
                        defaultMunicipalities={defaultMunicipalities}
                        className=""
                    />
                </LazyModal>
            )}
        </>
    );
}
