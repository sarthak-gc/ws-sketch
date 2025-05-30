import rough from "roughjs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { elementThere } from "./utils/elementThere";
import type { Element } from "./types/types";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Drawable } from "roughjs/bin/core";
import { isInTheEnds } from "./utils/isInTheEnds";
import { isInTheEdges } from "./utils/isInTheEdges";

const generator = rough.generator();
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<"Rectangle" | "Line">(
    "Rectangle"
  );
  const [action, setAction] = useState<string | null>();
  const [elements, setElements] = useState<Element[]>([]);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [element, setElement] = useState<Element | null>(null);
  const [grabbedElement, setGrabbedElement] = useState<Element | null>(null);
  const [resizeElem, setResizeElement] = useState<Element | null>(null);
  const [cornerSide, setCornerSide] = useState<{
    corner?: string;
    side?: string;
  } | null>(null);
  const [cursorDirection, setCursorDirection] = useState<
    "nwse-resize" | "nesw-resize" | null
  >();

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

  const drawShape = (rc: RoughCanvas, shape: Drawable | null) => {
    if (shape) {
      rc.draw(shape);
    }
  };

  const getShape = useCallback(
    (element: Element) => {
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
      return null;
    },
    [options]
  );

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
      const shape = getShape(elem);
      drawShape(rc, shape);
    });

    if (element) {
      const shape = getShape(element);
      drawShape(rc, shape);
    }
  }, [elements, element, getShape]);

  const createElement = (e: Element) => {
    const { shape } = e;
    if (shape == "Line" || shape == "Rectangle") {
      setElement(e);
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

  const moveElement = (grabbedElement: Element, e: MouseEvent) => {
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
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (action == "Drawing") {
      const id = crypto.randomUUID();
      createElement({
        shape: selectedShape,
        X1: posX,
        Y1: posY,
        X2: e.clientX,
        Y2: e.clientY,
        id,
      });
      return;
    }
    if (grabbedElement && action == "Grabbing") {
      moveElement(grabbedElement, e);
      return;
    }

    if (action == "Resizing" && resizeElem && cornerSide) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== resizeElem.id) return el;

          if (resizeElem.shape === "Line") {
            if (cornerSide.side === "TOP") {
              setCursorDirection("nwse-resize");
              return { ...el, X1: e.clientX, Y1: e.clientY };
            } else if (cornerSide.side === "Bottom") {
              setCursorDirection("nwse-resize");
              return { ...el, X2: e.clientX, Y2: e.clientY };
            }
          } else if (resizeElem.shape === "Rectangle") {
            if (cornerSide.corner === "TopLeft") {
              setCursorDirection("nwse-resize");
              return { ...el, X1: e.clientX, Y1: e.clientY };
            } else if (cornerSide.corner === "TopRight") {
              setCursorDirection("nesw-resize");
              return { ...el, Y1: e.clientY, X2: e.clientX };
            } else if (cornerSide.corner === "BottomLeft") {
              setCursorDirection("nesw-resize");
              return { ...el, X1: e.clientX, Y2: e.clientY };
            } else if (cornerSide.corner === "BottomRight") {
              setCursorDirection("nwse-resize");
              return { ...el, X2: e.clientX, Y2: e.clientY };
            }
          }

          return el;
        })
      );
      return;
    }

    for (let i = elements.length - 1; i >= 0; i--) {
      const isElemThere = elementThere(elements[i], e.clientX, e.clientY);

      if (isElemThere) {
        if (elements[i].shape === "Line") {
          const result = isInTheEnds(elements[i], e.clientX, e.clientY);
          if (result.status && action !== "Resizing") {
            setResizeElement(elements[i]);
            break;
          }
        } else if (elements[i].shape === "Rectangle") {
          const result = isInTheEdges(elements[i], e.clientX, e.clientY);
          if (result.status && action !== "Resizing") {
            setResizeElement(elements[i]);
            break;
          }
        }
        setAction("Dragging");
        const updatedElements = elements.map((el) =>
          el === elements[i]
            ? { ...el, color: "blue" }
            : { ...el, color: "black" }
        );
        setElements(updatedElements);
        setResizeElement(null);
        setCursorDirection(null);
        if (grabbedElement?.id != elements[i].id) {
          setGrabbedElement({ ...elements[i] });
        }

        break;
      } else {
        setGrabbedElement(null);
        setResizeElement(null);
        setCursorDirection(null);
        const updatedElements = elements.map((e) => {
          return { ...e, color: "black" };
        });

        setElements(updatedElements);
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (resizeElem) {
      setAction("Resizing");
      if (resizeElem.shape === "Line") {
        const result = isInTheEnds(resizeElem, e.clientX, e.clientY);
        if (result.status) {
          setCornerSide({ side: result.side });
        }
      } else if (resizeElem.shape === "Rectangle") {
        const result = isInTheEdges(resizeElem, e.clientX, e.clientY);
        if (result.status) {
          setCornerSide({ corner: result.corner });
        }
      }
      return;
    }

    if (grabbedElement && action !== "Drawing") {
      setAction("Grabbing");
      return;
    }

    if (action != "Grabbing") {
      setAction("Drawing");
      setPosX(e.clientX);
      setPosY(e.clientY);
      return;
    }
  };

  useEffect(() => {
    console.log(action);
  }, [action]);

  const handleMouseUp = () => {
    if (element) {
      const { X1, Y1, X2, Y2 } = element;

      if (X1 === X2 && Y1 === Y2) {
        return;
      }

      setElements((prev) => [...prev, element]);
      setElement(null);
    }

    setCornerSide(null);
    if (resizeElem) {
      setResizeElement(null);
    }

    setAction(null);

    if (action == "Grabbing" && !grabbedElement) {
      setSelectedShape("Rectangle");
      const updatedElements = elements.map((el) => {
        return { ...el, color: "black" };
      });
      setElements(updatedElements);
      setGrabbedElement(null);
    }
    setSelectedShape("Rectangle");
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
    <div
      className={`${
        cursorDirection
          ? `cursor-${cursorDirection}`
          : grabbedElement
          ? "cursor-move"
          : "cursor-default"
      }`}
    >
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
  selectedShape: "Line" | "Rectangle";
  setSelectedShape: (shape: "Line" | "Rectangle") => void;
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
    {["Rectangle", "Line"].map((shape) => (
      <div key={shape}>
        <label htmlFor={shape}>{shape}</label>
        <input
          type="radio"
          id={shape}
          name="shape"
          value={shape}
          checked={selectedShape === shape}
          onChange={() =>
            setSelectedShape(shape == "Line" ? "Line" : "Rectangle")
          }
        />
      </div>
    ))}
  </div>
);
