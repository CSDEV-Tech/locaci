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
    const formId = React.useId();

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
                    onClose={() => setIsOpen(false)}
                    footer={
                        <div className="flex w-full justify-center">
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}>
                                    Annuler
                                </Button>

                                <Button
                                    form={formId}
                                    variant="primary"
                                    type={'submit'}>
                                    Appliquer les filtres
                                </Button>
                            </div>
                        </div>
                    }>
                    <FiltersForm
                        formId={formId}
                        hideButtons
                        onSubmit={() => setIsOpen(false)}
                        defaultMunicipalities={defaultMunicipalities}
                        className=""
                    />
                </LazyModal>
            )}
        </>
    );
}
