export type Element = {
  shape: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  color?: string;
  id: string;
};

export type Shapes = "Line" | "Rectangle" | "Arrow" | "Circle" | "Diamond";
