import { z } from 'zod';
import create from 'zustand';
import { searchSchema } from './validation-schemas/search-schema';

type FilterState = z.infer<typeof searchSchema> & {
    showFilters: boolean;
    toggleMap: () => void;
    showFilterModal: () => void;
    closeFilterModal: () => void;
};

export const useFilterStore = create<FilterState>(set => ({
    showFilters: false,
    toggleMap: () =>
        set(state => ({ view: state.view === 'LIST' ? 'MAP' : 'LIST' })),
    showFilterModal: () => set(state => ({ showFilters: true })),
    closeFilterModal: () => set(state => ({ showFilters: false }))
}));
