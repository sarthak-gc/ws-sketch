import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

interface TabStoreI {
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
}

export const useTabStore = create<TabStoreI>()(
  persist(
    (set) => ({
      activeTabId: null,
      setActiveTabId: (id: string | null) => set({ activeTabId: id }),
    }),
    {
      name: "Tab",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
