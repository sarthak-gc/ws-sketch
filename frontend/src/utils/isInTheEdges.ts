// first get teh mouse position, then check if element is there, if element exists at that point, check if the mouse is there at the edge of the shape,

import type { Element } from "../types/types";

//  for lines , directly checking x with x1 and x2 and y with y1 and y2 work

// for rectangle check x and y with x1 and y1, x1 +x2 and y1+y2(released corner), then with x1 and y1 + y2 and finally with y1 and x1+x2

export const isInTheEdges = (element: Element, x: number, y: number) => {
  const { X1, Y1, X2, Y2 } = element;

  const atTopLeft = Math.abs(x - X1) <= 10 && Math.abs(y - Y1) <= 10;
  const atTopRight = Math.abs(x - X1) <= 10 && Math.abs(y - Y2) <= 10;
  const atBottomLeft = Math.abs(x - X2) <= 10 && Math.abs(y - Y1) <= 10;
  const atBottomRight = Math.abs(x - X2) <= 10 && Math.abs(y - Y2) <= 10;

  if (atTopLeft || atTopRight || atBottomLeft || atBottomRight) {
    let corner = "";
    if (atTopLeft) corner = "TopLeft";
    else if (atTopRight) corner = "TopRight";
    else if (atBottomLeft) corner = "BottomLeft";
    else if (atBottomRight) corner = "BottomRight";

    return { status: true, elem: element.id, corner };
  }

  return { status: false };
};
