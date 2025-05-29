import type { Element } from "../types/types";

// GPT dost
function isPointOnLineSegment(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance = 5
): boolean {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy) <= tolerance;
}

export const elementThere = (element: Element, x: number, y: number) => {
  const { shape, X1, Y1, X2, Y2 } = element;
  if (shape == "Line") {
    return isPointOnLineSegment(x, y, X1, Y1, X2, Y2);
  } else {
    const { X1, X2, Y1, Y2 } = element;
    if (
      x + 5 >= Math.min(X1, X2) &&
      x - 5 <= Math.max(X1, X2) &&
      y + 5 >= Math.min(Y1, Y2) &&
      y - 5 <= Math.max(Y1, Y2)
    ) {
      return true;
    }
  }

  return false;
};
