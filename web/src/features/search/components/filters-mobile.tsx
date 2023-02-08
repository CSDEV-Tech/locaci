'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { SliderIcon } from '@locaci/ui/components/atoms/icons/slider';
import { XIcon } from '@locaci/ui/components/atoms/icons/x';

// utils
import { useFilterStore } from '~/lib/store';
import { clsx } from '@locaci/ui/lib/functions';

// types
export type FiltersMobileProps = {
    defaultMunicipalities: { label: string; value: string }[];
};

import { FiltersForm } from './filters-form';

export function FiltersMobile({ defaultMunicipalities }: FiltersMobileProps) {
    const showFilterModal = useFilterStore(state => state.showFilterModal);
    return (
        <>
            <Button
                variant="primary"
                onClick={showFilterModal}
                renderTrailingIcon={cls => <SliderIcon className={cls} />}>
                Modifier les filtres
            </Button>

            <FilterModal defaultMunicipalities={defaultMunicipalities} />
        </>
    );
}

function FilterModal(props: Pick<FiltersMobileProps, 'defaultMunicipalities'>) {
    const filterStore = useFilterStore();

    React.useEffect(() => {
        // Hide all elements from screen readers
        const elementsToHide = document.querySelectorAll(
            `main,header,footer,body`
        );
        for (let i = 0; i < elementsToHide.length; i++) {
            const element = elementsToHide[i];
            if (filterStore.showFilters) {
                element.setAttribute(`aria-hidden`, 'true');
                (element as HTMLElement).style.overflow = 'hidden';
            } else {
                element.removeAttribute('aria-hidden');
                (element as HTMLElement).style.removeProperty('overflow');
            }
        }
    }, [filterStore.showFilters]);

    return (
        <aside
            title="Terminé"
            className={clsx(
                'fixed inset-0 z-40 bg-white',
                'overflow-scroll p-4',
                'md:p-8 lg:hidden',
                'animate-translate-up',
                {
                    hidden: !filterStore.showFilters
                }
            )}>
            <div className="mx-auto flex max-w-[500px] flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">
                        Modifiez votre recherche
                    </h2>

                    <Button
                        aria-label="Annuler"
                        square
                        variant="dark"
                        onClick={filterStore.closeFilterModal}
                        renderTrailingIcon={cls => (
                            <XIcon className={cls} weight="bold" />
                        )}
                    />
                </div>

                <FiltersForm
                    onSubmit={filterStore.closeFilterModal}
                    defaultMunicipalities={props.defaultMunicipalities}
                />
            </div>
        </aside>
    );
}
