import { create } from 'zustand';

type useStoreModalProps = {
    isStoreModalOpen: boolean
    openStoreModal: () => void
    closeStoreModal: () => void
}

export const useStoreModal = create<useStoreModalProps>((set) => ({
    isStoreModalOpen: false,
    openStoreModal: () => set(() => ({ isStoreModalOpen: true })),
    closeStoreModal: () => set(() => ({ isStoreModalOpen: false })),
}))