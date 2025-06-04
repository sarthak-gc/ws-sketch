import type { Element } from "../types/types";

export const createElement = (
  e: Element,
  setElement: (element: Element) => void
) => {
  setElement(e);
};
