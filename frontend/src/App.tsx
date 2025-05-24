import rough from "roughjs";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { RoughCanvas } from "roughjs/bin/canvas";

const generator = rough.generator();

interface RectEndI {
  height: number;
  width: number;
}
interface LinEndI {
  X: number;
  Y: number;
}
interface StartI {
  X: number;
  Y: number;
}
// rect and line as of now
interface ShapeI {
  start: StartI;
  end: LinEndI | RectEndI;
}

type Element = {
  shape: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
};
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [linePosition, setLinePosition] = useState<ShapeI>({
    start: {
      X: 0,
      Y: 0,
    },
    end: {
      X: 0,
      Y: 0,
    },
  });
  const [rectPosition, setRectPosition] = useState<ShapeI>({
    start: {
      X: 0,
      Y: 0,
    },
    end: {
      height: 0,
      width: 0,
    },
  });

  const [selectedShape, setSelectedShape] = useState<string>("Rectangle");
  const [action, setAction] = useState<string>("Draw");
  const [elements, setElements] = useState<Element[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [grabbedElement, setGrabbedElement] = useState<Element | null>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    // const ctx = canvasRef.current.getContext("2d");
    // ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [selectedShape, elements]);

  const drawElem = (rc: RoughCanvas, X2: number, Y2: number) => {
    if (selectedShape === "Line") {
      const { X, Y } = linePosition.start;
      const line = generator.line(X, Y, X2, Y2);
      rc.draw(line);

      setElements((prev) => [
        ...prev,
        {
          shape: selectedShape,
          X1: X,
          Y1: Y,
          X2,
          Y2,
        },
      ]);
    } else if (selectedShape == "Rectangle") {
      const { X, Y } = rectPosition.start;
      const rect = generator.rectangle(X, Y, X2, Y2);
      rc.draw(rect);
      setElements((prev) => [
        ...prev,
        {
          shape: selectedShape,
          X1: X,
          Y1: Y,
          X2,
          Y2,
        },
      ]);
    }
  };

  const elementThere = (element: Element, x: number, y: number) => {
    if (element.shape == "Line") {
      const d1 = element.X2 - element.X1;
      const n1 = element.Y2 - element.Y1;
      if (n1 == 0 || d1 == 0) return true;
      const slopeOfLine = n1 / d1;

      const d2 = element.X1 - x;
      const n2 = element.Y1 - y;
      if (n2 == 0 || d2 == 0) return true;

      const slopeWrtPoint = n2 / d2;

      if (Math.abs(slopeWrtPoint - slopeOfLine) < 0.1) return true;
    } else {
      if (
        x >= element.X1 &&
        x <= element.X1 + element.X2 &&
        y >= element.Y1 &&
        y <= element.Y1 + element.Y2
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log(grabbedElement);
  }, [grabbedElement]);
  const handleMouseRelease = (e: MouseEvent) => {
    if (!canvasRef.current) {
      return;
    }

    const rc = rough.canvas(canvasRef.current);

    if (action == "Draw") {
      if (selectedShape == "Line") {
        drawElem(rc, e.clientX, e.clientY);
      } else if (selectedShape == "Rectangle") {
        const height = e.clientY - rectPosition.start.Y;
        const width = e.clientX - rectPosition.start.X;
        drawElem(rc, width, height);
      }
    } else {
      let i;
      let skipped = false;
      for (i = elements.length - 1; i >= 0; i--) {
        if (elementThere(elements[i], e.clientX, e.clientY)) {
          skipped = true;
          break;
        }
      }

      if (skipped) {
        setGrabbedElement(elements[i]);
      }
      setAction("Draw");
    }

    setIsDrawing(false);
  };

  const handleMouseSelect = (e: MouseEvent) => {
    setRectPosition((prev) => {
      return { ...prev, start: { X: e.clientX, Y: e.clientY } };
    });
    setLinePosition((prev) => {
      return { ...prev, start: { X: e.clientX, Y: e.clientY } };
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDrawing && !isDrawing) {
      // reDraw?????????
      console.log(e);
    }
  };

  return (
    <div>
      <div className="fixed bg-red-500 flex gap-40">
        <div>
          <label htmlFor="rect">Rectangle</label>
          <input
            onChange={() => {
              setAction("Draw");
              setSelectedShape("Rectangle");
            }}
            type="radio"
            value={"Rectangle"}
            id="rect"
            name="shape"
            checked={selectedShape === "Rectangle"}
          />
        </div>
        <div>
          <label htmlFor="line">Line</label>
          <input
            onChange={() => {
              setAction("Draw");
              setSelectedShape("Line");
            }}
            type="radio"
            value={"line"}
            id="line"
            name="shape"
            checked={selectedShape === "Line"}
          />
        </div>
        <div>
          <label htmlFor="grab">Grab</label>
          <input
            onChange={() => setAction("Grab")}
            type="radio"
            value={"Grab"}
            id="grab"
            name="shape"
            checked={action === "Grab"}
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseSelect}
        onMouseUp={handleMouseRelease}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
};

export default App;
