import type { Element } from "../types/types";

export const isInTheEnds = (element: Element, x: number, y: number) => {
  const { X1, Y1, X2, Y2 } = element;

  const atEnd1 = Math.abs(x - X1) <= 10 && Math.abs(y - Y1) <= 10;
  const atEnd2 = Math.abs(x - X2) <= 10 && Math.abs(y - Y2) <= 10;

  if (atEnd1 || atEnd2) {
    const side = atEnd1 ? "TOP" : "Bottom";
    return {
      status: true,
      elem: element.id,
      side,
    };
  }

  return { status: false };
};
