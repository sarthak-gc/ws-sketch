import rough from "roughjs";

import type { Element } from "../../types/types";
import type { Point } from "roughjs/bin/geometry";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Drawable } from "roughjs/bin/core";

const generator = rough.generator();
export const getShape = (element: Element) => {
  const options = {
    roughness: 1.5,
    strokeWidth: 1.2,
    seed: 1,
  };

  const { X1, Y1, X2, Y2 } = element;
  const height = Y2 - Y1;
  const width = X2 - X1;

  if (element.shape == "Line")
    return generator.line(X1, Y1, X2, Y2, {
      ...options,
      stroke: element.color ? element.color : "black",
    });
  if (element.shape == "Rectangle")
    return generator.rectangle(X1, Y1, width, height, {
      ...options,
      stroke: element.color ? element.color : "black",
    });

  if (element.shape == "Circle") {
    const centerX = X1 + width / 2;
    const centerY = Y1 + height / 2;

    return generator.ellipse(centerX, centerY, width, height, {
      ...options,
      stroke: element.color ? element.color : "black",
    });
  }

  if (element.shape == "Arrow") {
    // tauko kasari?
    const line = generator.line(X1, Y1, X2, Y2, {
      ...options,
      stroke: element.color ? element.color : "black",
    });

    // let tilted1;
    // let tilted2;

    return line;
  }

  // gpt bro
  if (element.shape === "Diamond") {
    const centerX = X1 + width / 2;
    const centerY = Y1 + height / 2;

    const pointsObj = [
      { x: centerX, y: Y1 },
      { x: X2, y: centerY },
      { x: centerX, y: Y2 },
      { x: X1, y: centerY },
    ];

    const points: Point[] = pointsObj.map((point) => [point.x, point.y]);

    return generator.polygon(points, {
      ...options,
      stroke: element.color ? element.color : "black",
    });
  }

  return null;
};

export const drawShape = (rc: RoughCanvas, shape: Drawable | null) => {
  if (shape) {
    rc.draw(shape);
  }
};
