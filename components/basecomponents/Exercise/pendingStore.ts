import { create } from 'zustand';

interface PendingStore {
  pending: boolean;
  setPending: (val: boolean) => void;
}

// global state of pending action, ActionButtons are disabled when pending is true
export const usePendingStore = create<PendingStore>((set) => ({
  pending: false,
  setPending: (val) => set({ pending: val }),
}));
