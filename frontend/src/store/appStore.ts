import { create } from "zustand";
import type { User } from "./userInfoStore";
import { createJSONStorage, persist } from "zustand/middleware";

interface TabVisualI {
  tabId: string;
  tabName: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface TabI extends TabVisualI {
  Collaborators: User[];
  owner: User;
  elements?: string;
  isEditable: boolean;
}

interface AppI {
  tabs: TabVisualI[];
  recent5Tabs: TabI[];

  addTab: (tab: TabVisualI) => void;
  setTabs: (tabs: TabVisualI[]) => void;
  setRecent5Tabs: (tab: TabI) => void;

  updateTab?: (tabId: string, elements: string) => void; // might need this to change the data, can't think of implementing it right now
}

export const useAppStore = create<AppI>()(
  persist(
    (set) => ({
      tabs: [],
      recent5Tabs: [],
      setTabs: (tabs: TabVisualI[]) => set({ tabs }),

      addTab: (tab: TabVisualI) =>
        set((prev) => ({
          tabs: [...prev.tabs, tab],
        })),

      setRecent5Tabs: (tab: TabI) =>
        set((state) => {
          const updatedTabs = [
            tab,
            ...state.recent5Tabs.filter((t) => t.tabId !== tab.tabId),
          ];
          if (updatedTabs.length > 5) {
            updatedTabs.pop();
          }
          return { recent5Tabs: updatedTabs };
        }),
    }),
    {
      name: "App",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
