import type { Element } from "../App";

export const isInTheEdges = (Element: Element, x: number, y: number) => {
  const { X1, Y1, X2, Y2 } = Element;

  const atEnd1 = x == X1 && y == Y1;
  const atEnd2 = x == X2 && y == Y2;
  if (atEnd1 || atEnd2) {
    return { status: true, elem: Element.id };
  }

  return { status: false };
};
