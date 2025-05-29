import type { Element } from "../types/types";

export const createElement = (
  e: Element,
  setElement: (element: Element) => void
) => {
  const { shape, X1, Y1, X2, Y2, id } = e;
  if (shape == "Line") {
    setElement({ shape, X1, Y1, X2, Y2, id });
  } else if (shape == "Rectangle") {
    setElement({ shape, X1, Y1, X2, Y2, id });
  }
};

