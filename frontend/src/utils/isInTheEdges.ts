// first get teh mouse position, then check if element is there, if element exists at that point, check if the mouse is there at the edge of the shape,

import type { Element } from "../App";

//  for lines , directly checking x with x1 and x2 and y with y1 and y2 work

// for rectangle check x and y with x1 and y1, x1 +x2 and y1+y2(released corner), then with x1 and y1 + y2 and finally with y1 and x1+x2

export const isInTheEdges = (Element: Element, x: number, y: number) => {
  const { X1, Y1, X2, Y2 } = Element;

  const atTopLeft = x == X1 && y == Y1;
  const atTopRight = x == X1 && y == Y2;
  const atBottomLeft = x == X2 && y == Y1;
  const atBottomRight = x == X2 && y == Y2;

  if (atTopLeft || atTopRight || atBottomLeft || atBottomRight) {
    return { status: true, elem: Element.id };
  }

  return { status: false };
};
