import { create } from "zustand";

type MyListState = {
  lists: Record<string, string[]>;
  has: (profileId: string, titleId: string) => boolean;
  toggle: (profileId: string, titleId: string) => void;
};

export const useMyList = create<MyListState>((set, get) => ({
  lists: {},
  has: (profileId, titleId) => (get().lists[profileId] ?? []).includes(titleId),
  toggle: (profileId, titleId) => {
    set((state) => {
      const current = state.lists[profileId] ?? [];
      const next = current.includes(titleId)
        ? current.filter((id) => id !== titleId)
        : [...current, titleId];

      return {
        lists: {
          ...state.lists,
          [profileId]: next,
        },
      };
    });
  },
}));