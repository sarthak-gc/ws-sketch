import rough from "roughjs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { Actions, Element, Shapes } from "../types/types";
import type { Drawable } from "roughjs/bin/core";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Point } from "roughjs/bin/geometry";
import { isInTheEnds } from "../utils/isInTheEnds";
import { elementThere } from "../utils/elementThere";
import { isInTheEdges } from "../utils/isInTheEdges";
import { Options } from "../components/Toolbar";
import KeyboardShortcutsModal from "../components/Shortcuts";
import Tutorial from "../components/Guide";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const generator = rough.generator();
const WorkSpace = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<Shapes>("Rectangle");
  const [action, setAction] = useState<Actions | null>();
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
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const socketInstance = useRef<WebSocket | null>(null);

  const [othersDrawing, setOthersDrawing] = useState<Element>();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const x = /Mobi|Android|iPhone|iPad|Windows Phone|Tablet/i.test(userAgent)
      ? "Mobile"
      : "Desktop";
    if (x == "Desktop") {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  }, []);

  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      deferredPrompt = event;

      const addBtn = document.getElementById(
        "add-to-home-screen-btn"
      ) as HTMLElement | null;
      if (addBtn) {
        addBtn.style.display = "block";
      }

      addBtn?.addEventListener("click", () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the A2HS prompt");
            } else {
              console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
          });
        }
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000");
    socketInstance.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({}));
    };

    ws.onmessage = (e) => {
      let a;
      try {
        a = JSON.parse(e.data);
      } catch (err) {
        const x = err;
        JSON.stringify(x);
        a = e.data;
      } finally {
        if (a != "UserId Needed") {
          console.log(a["123"].element);
          setOthersDrawing(a["123"].element);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const socket = socketInstance.current;

      if (socket && elements) {
        // socket.send(JSON.stringify(elements));
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [elements]);

  // useEffect(() => {
  //   console.log("other: ", othersDrawing);
  // }, [othersDrawing]);

  useEffect(() => {
    const socket = socketInstance.current;

    if (socket && element) {
      const message = {
        "123": element,
      };

      socket.send(JSON.stringify(message));
    }
  }, [element]);

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
    },
    [options]
  );

  useEffect(() => {
    const showTutorial = localStorage.getItem("show_tutorial");
    if (showTutorial == "false") {
      setShowTutorial(false);
    }
    setIsLoading(false);
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

    if (othersDrawing) {
      const shape = getShape(othersDrawing);
      console.log("other drawing shape", shape);
      drawShape(rc, shape);
    }
  }, [elements, element, getShape, othersDrawing]);

  const createElement = (e: Element) => {
    setElement(e);
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
        if (e.ctrlKey) {
          switch (e.key) {
            case "d":
              clearEverything();
              break;
            case "s":
              setIsModalOpen((prev) => !prev);
              break;
          }
        }
        switch (e.key) {
          case "1":
            setSelectedShape("Rectangle");
            break;
          case "2":
            setSelectedShape("Line");
            break;
          case "3":
            setSelectedShape("Arrow");
            break;
          case "4":
            setSelectedShape("Circle");
            break;
          case "5":
            setSelectedShape("Diamond");
            break;
          case "Backspace":
            handleDelete();
            break;
          default:
            break;
        }
        return;
      }
      if (e.key == "Escape") {
        const updatedElements = elements.map((e) => {
          return { ...e, color: "black" };
        });
        setElements(updatedElements);
        setGrabbedElement(null);
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
      const updatedElements = elements.map((el) => {
        return { ...el, color: "black" };
      });
      setElements(updatedElements);
      setGrabbedElement(null);
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
    localStorage.setItem("show_tutorial", String(false));
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 py-6">
          <p className="text-center text-gray-700">
            Sorry, this application is not fully supported on your device at
            this time. Please use a desktop for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        cursorDirection
          ? `cursor-${cursorDirection}`
          : grabbedElement
          ? "cursor-move"
          : "cursor-default"
      } w-[max(100vh,100vw)] bg-[#dadada]`}
      style={{
        backgroundImage:
          "radial-gradient(circle, #cacaca 2px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <Options
        setShowTutorial={setShowTutorial}
        toggleModal={toggleModal}
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
      {showTutorial && !isLoading && <Tutorial showTutorial={showTutorial} />}

      {isModalOpen && <KeyboardShortcutsModal onClose={toggleModal} />}
    </div>
  );
};

export default WorkSpace;
