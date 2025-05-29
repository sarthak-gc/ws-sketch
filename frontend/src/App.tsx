import rough from "roughjs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { elementThere } from "./utils/elementThere";

const generator = rough.generator();

export type Element = {
  shape: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  color?: string;
  id: string;
};

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<string>("Rectangle");
  const [elements, setElements] = useState<Element[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [element, setElement] = useState<Element | null>(null);
  const [grabbedElement, setGrabbedElement] = useState<Element | null>(null);

  // useEffect(() => {
  //   const socket = new WebSocket("ws://localhost:9000");

  //   socket.onopen = () => {
  //     socket.send(JSON.stringify(elements));
  //   };

  //   socket.onmessage = (event) => {
  //     const data = event.data;
  //     if (data) {
  //       localStorage.setItem("elements", data);
  //     }
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [elements]);

  const [options] = useState({
    roughness: 1.5,
    strokeWidth: 1.2,
    seed: 1,
  });
  useEffect(() => {
    const storedElem = localStorage.getItem("elements");
    if (storedElem) {
      setElements(JSON.parse(storedElem));
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    const rc = rough.canvas(canvasRef.current);

    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const elementsC = elements.map((elem) => {
      return { ...elem, color: undefined };
    });
    localStorage.setItem("elements", JSON.stringify(elementsC));

    elements.forEach((elem: Element) => {
      const { X1, Y1, X2, Y2 } = elem;

      const height = Y2 - Y1;
      const width = X2 - X1;

      const shape =
        elem.shape == "Line"
          ? generator.line(X1, Y1, X2, Y2, {
              ...options,
              stroke: elem.color ? elem.color : "black",
            })
          : elem.shape == "Rectangle"
          ? generator.rectangle(X1, Y1, width, height, {
              ...options,
              stroke: elem.color ? elem.color : "black",
            })
          : null;
      if (shape) rc.draw(shape);
    });

    if (element) {
      const { X1, Y1, X2, Y2 } = element;
      const height = Y2 - Y1;
      const width = X2 - X1;
      const shape =
        element.shape == "Line"
          ? generator.line(X1, Y1, X2, Y2, {
              ...options,
              stroke: element.color ? element.color : "black",
            })
          : element.shape == "Rectangle"
          ? generator.rectangle(X1, Y1, width, height, {
              ...options,
              stroke: element.color ? element.color : "black",
            })
          : null;

      if (shape) {
        rc.draw(shape);
      }
    }
  }, [selectedShape, elements, element, options, grabbedElement]);

  const createElement = (e: Element) => {
    const { shape, X1, Y1, X2, Y2, id } = e;
    if (shape == "Line") {
      setElement({ shape, X1, Y1, X2, Y2, id });
    } else if (shape == "Rectangle") {
      setElement({ shape, X1, Y1, X2, Y2, id });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (selectedShape != "Grab") {
      setIsDrawing(true);
      setPosX(e.clientX);
      setPosY(e.clientY);
      return;
    }

    setIsDrawing(false);
    for (let i = elements.length - 1; i >= 0; i--) {
      const isElemThere = elementThere(elements[i], e.clientX, e.clientY);

      if (isElemThere) {
        const updatedElements = elements.map((el) =>
          el === elements[i]
            ? { ...el, color: "blue" }
            : { ...el, color: "black" }
        );
        setElements(updatedElements);
        setGrabbedElement({ ...elements[i] });
        break;
      } else {
        setGrabbedElement(null);

        const updatedElements = elements.map((e) => {
          return { ...e, color: "black" };
        });

        setElements(updatedElements);
      }
    }
  };

  const undo = () => {
    const filtered = elements.filter((_, index) => {
      return index !== elements.length - 1;
    });
    setElements(filtered);
  };
  const handleDelete = useCallback(() => {
    const updatedElements = elements.filter((elem) => {
      return elem.id != grabbedElement?.id;
    });
    setElements(updatedElements);
    setGrabbedElement(null);
  }, [grabbedElement?.id, elements]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!grabbedElement) {
        return;
      }
      console.log(e.key);
      if (e.key == "Backspace") {
        handleDelete();
      } else if (e.key == "Escape") {
        const updatedElements = elements.map((e) => {
          return { ...e, color: "black" };
        });
        setElements(updatedElements);
        setGrabbedElement(null);
        setSelectedShape("Rectangle");
      }
    },
    [handleDelete, grabbedElement, elements]
  );

  useEffect(() => {
    window.document.addEventListener("keydown", handleKeyPress);
    return () => {
      window.document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDrawing) {
      const id = crypto.randomUUID();
      createElement({
        shape: selectedShape,
        X1: posX,
        Y1: posY,
        X2: e.clientX,
        Y2: e.clientY,
        id,
      });
    }
    if (grabbedElement) {
      if (selectedShape == "Grab") {
        const width = grabbedElement.X2 - grabbedElement.X1;
        const height = grabbedElement.Y2 - grabbedElement.Y1;

        const centerX = e.clientX;
        const centerY = e.clientY;

        setElements((prev) =>
          prev.map((elem) =>
            elem.id === grabbedElement.id
              ? {
                  ...elem,
                  X1: centerX - width / 2,
                  Y1: centerY - height / 2,
                  X2: centerX + width / 2,
                  Y2: centerY + height / 2,
                }
              : elem
          )
        );

        setPosX(e.clientX);
        setPosY(e.clientY);
      }
    }
  };

  const handleMouseUp = () => {
    if (element) {
      const { X1, Y1, X2, Y2 } = element;

      if (X1 === X2 && Y1 === Y2) {
        return;
      }

      setElements((prev) => [...prev, element]);
      setElement(null);
    }
    setIsDrawing(false);

    if (selectedShape == "Grab") {
      if (!grabbedElement) {
        setSelectedShape("Rectangle");
        const updatedElements = elements.map((el) => {
          return { ...el, color: "black" };
        });
        setElements(updatedElements);
        setGrabbedElement(null);
      }
    }
  };

  const clearEverything = () => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    setElements([]);
    localStorage.clear();
  };

  return (
    <div>
      <Options
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        clearEverything={clearEverything}
        undo={undo}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
};

export default App;

type ToolbarProps = {
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  clearEverything: () => void;
  undo: () => void;
};

export const Options = ({
  selectedShape,
  setSelectedShape,
  clearEverything,
  undo,
}: ToolbarProps) => (
  <div className="fixed bg-red-500 flex gap-40">
    <button onClick={clearEverything}>Clear</button>

    <button onClick={undo}>Remove last element</button>
    {["Rectangle", "Line", "Grab"].map((shape) => (
      <div key={shape}>
        <label htmlFor={shape}>{shape}</label>
        <input
          type="radio"
          id={shape}
          name="shape"
          value={shape}
          checked={selectedShape === shape}
          onChange={() => setSelectedShape(shape)}
        />
      </div>
    ))}
  </div>
);
