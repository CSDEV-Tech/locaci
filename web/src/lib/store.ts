import { z } from 'zod';
import create from 'zustand';
import { searchSchema } from './validation-schemas/search-schema';

type FilterModalState = {
    showFilters: boolean;
    showFilterModal: () => void;
    closeFilterModal: () => void;
};

export const useFilterStore = create<FilterModalState>(set => ({
    showFilters: false,
    showFilterModal: () => set(state => ({ showFilters: true })),
    closeFilterModal: () => set(state => ({ showFilters: false }))
}));

type SearchStore = {
    isSearching: boolean;
    showPagination: boolean;
    setStatus: (arg: { isLoading: boolean; showPagination: boolean }) => void;
};

export const useSearchStore = create<SearchStore>(set => ({
    isSearching: false,
    showPagination: false,
    setStatus: ({ isLoading: status, showPagination }) =>
        set(state => ({ isSearching: status, showPagination }))
}));
