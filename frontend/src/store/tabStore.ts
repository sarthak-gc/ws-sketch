import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

interface TabStoreI {
  activeTabId: string;
  setActiveTabId: (id: string) => void;
}

export const useTabStore = create<TabStoreI>()(
  persist(
    (set) => ({
      activeTabId: "",
      setActiveTabId: (id: string) => set({ activeTabId: id }),
    }),
    {
      name: "Tab",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
