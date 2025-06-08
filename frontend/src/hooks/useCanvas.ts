import { useEffect, useRef } from "react";
import type { Element } from "../types/types";

import rough from "roughjs";
import { drawShape, getShape } from "../utils/canvas/draw";

const useCanvas = (
  elements: Element[],
  element: Element | null
  // othersDrawings: Element[]
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    const rc = rough.canvas(canvasRef.current);

    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    elements.forEach((elem: Element) => {
      const shape = getShape(elem);
      drawShape(rc, shape);
    });

    if (element) {
      const shape = getShape(element);
      drawShape(rc, shape);
    }

    // if (othersDrawings.length > 0) {
    //   othersDrawings.forEach((drawing) => {
    //     const shape = getShape(drawing);
    //     drawShape(rc, shape);
    //   });
    // }
  }, [elements, element]);

  return { canvasRef };
};

export default useCanvas;
