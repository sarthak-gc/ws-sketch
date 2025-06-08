import { create } from "zustand";
import type { Actions, Element, Shapes } from "../types/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface workSpaceStoreI {
  grabbedElement: Element | null;
  copiedElement: Element | null;
  elements: Element[];
  shape: Shapes | null;
  action: Actions | null;
  drawingElement: Element | null;

  setGrabbedElement: (elem: Element | null) => void;
  setCopiedElement: (elem: Element | null) => void;
  setElements: (elem: Element[] | Element) => void;
  setShape: (val: Shapes) => void;
  setAction: (val: Actions | null) => void;
  setDrawingElement: (elem: Element) => void;
  clearDrawingElement: (val: null) => void;
  clearGrabbedElement: (val: null) => void;
}

export const useWorkSpaceStore = create<workSpaceStoreI>()(
  persist(
    (set) => ({
      grabbedElement: null,
      elements: [],
      copiedElement: null,
      shape: null,
      drawingElement: null,
      action: null,

      setShape: (val: Shapes) => set(() => ({ shape: val })),
      setAction: (val: Actions | null) => set(() => ({ action: val })),

      setDrawingElement: (elem: Element) =>
        set(() => ({ drawingElement: elem })),

      setCopiedElement: (elem: Element | null) =>
        set(() => ({ copiedElement: elem })),

      setGrabbedElement: (elem: Element | null) =>
        set(() => ({ grabbedElement: elem })),

      setElements: (elem: Element[] | Element) =>
        set((prev) => ({
          elements: Array.isArray(elem)
            ? [...prev.elements, ...elem]
            : [...prev.elements, elem],
        })),

      clearDrawingElement: () => set(() => ({ drawingElement: null })),
      clearGrabbedElement: () => set(() => ({ grabbedElement: null })),
    }),
    {
      name: "app",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
