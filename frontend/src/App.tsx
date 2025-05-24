import rough from "roughjs";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const generator = rough.generator();

interface LinePosI {
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
}
interface RectPosI {
  X: number;
  Y: number;
  width: number;
  height: number;
}
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [linePosition, setLinePosition] = useState<LinePosI>({
    X1: 0,
    Y1: 0,
    X2: 0,
    Y2: 0,
  });
  const [rectPosition, setRectPosition] = useState<RectPosI>({
    X: 0,
    Y: 0,
    height: 0,
    width: 0,
  });
  const [selectedShape, setSelectedShape] = useState<string>("Rectangle");

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    // const ctx = canvasRef.current.getContext("2d");

    // ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [selectedShape]);

  const handleMouseRelease = (e: MouseEvent) => {
    if (!canvasRef.current) {
      return;
    }
    const rc = rough.canvas(canvasRef.current);

    if (selectedShape == "Line") {
      setLinePosition((prev) => {
        return { ...prev, X2: e.clientX, Y2: e.clientY };
      });
      const { X1, Y1 } = linePosition;
      const line = generator.line(X1, Y1, e.clientX, e.clientY);
      rc.draw(line);
    } else if (selectedShape == "Rectangle") {
      const height = e.clientY - rectPosition.Y;
      const width = e.clientX - rectPosition.X;
      setRectPosition((prev) => {
        return { ...prev, height, width };
      });

      const { X, Y } = rectPosition;
      const rect = generator.rectangle(X, Y, width, height);
      rc.draw(rect);
    }
    setIsDrawing(false);
  };

  const handleMouseSelect = (e: MouseEvent) => {
    setRectPosition((prev) => {
      return { ...prev, X: e.clientX, Y: e.clientY };
    });
    setLinePosition((prev) => {
      return { ...prev, X1: e.clientX, Y1: e.clientY };
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDrawing) {
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
            onChange={() => setSelectedShape("Rectangle")}
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
            onChange={() => setSelectedShape("Line")}
            type="radio"
            value={"line"}
            id="line"
            name="shape"
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
