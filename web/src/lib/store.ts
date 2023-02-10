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

type SearchStore = {
    selectedId: string | null;
    selectProperty: (id: string | null) => void;
};

export const useSearchMapSelectionStore = create<SearchStore>(set => ({
    selectedId: null,
    selectProperty: id =>
        set(state => ({
            selectedId: id
        }))
}));
