import create from 'zustand';

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
