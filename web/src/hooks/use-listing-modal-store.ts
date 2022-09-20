import create from 'zustand';
type ModalStoreState = {
    open: boolean;
    show: () => void;
    hide: () => void;
};

export const useListingModalStore = create<ModalStoreState>(set => ({
    open: false,
    show() {
        set(() => ({ open: true }));
    },
    hide() {
        set(() => ({ open: false }));
    }
}));
