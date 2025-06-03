import { useCallback, useEffect, useState, type MouseEvent } from "react";
import type { Actions, Collaborator, Element, Shapes } from "../types/types";

import { isInTheEnds } from "../utils/isInTheEnds";
import { elementThere } from "../utils/elementThere";
import { isInTheEdges } from "../utils/isInTheEdges";
import { Options } from "../components/Toolbar";
import KeyboardShortcutsModal from "../components/Shortcuts";
import Tutorial from "../components/Guide";
import useDetectMobile from "../hooks/useDetectMobile";
import useBeforeInstallPrompt from "../hooks/useBeforeInstallPrompt";
import useWebSockets from "../hooks/useWebSockets";
import useLocalStorage from "../hooks/useLocalStorage";
import useCanvas from "../hooks/useCanvas";
import useDebouncedWs from "../hooks/useDebouncedWs";
import useSendCurrentDrawingElement from "../hooks/useDrawingElement";
import ControlPanel from "../components/ControlPanel";
import Sidebar from "../components/Sidebar";
import { useUserInfoStore } from "../store/userInfoStore";
import { AXIOS_TAB } from "../utils/axios/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTabStore } from "../store/tabStore";
import { AxiosError } from "axios";

const WorkSpace = () => {
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
  const [id, setId] = useState("");
  const isLoggedIn = useUserInfoStore().isLoggedIn;

  const navigate = useNavigate();
  const [isValidTab, setIsValidTab] = useState<boolean>(false);
  const [isTabDataLoading, setIsTabDataLoading] = useState<boolean>(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const activeTabId = useTabStore().activeTabId;
  const tabId = useParams().tabId;
  useEffect(() => {
    if (tabId && tabId !== activeTabId) {
      const setActiveTabId = useTabStore.getState().setActiveTabId;
      setActiveTabId(tabId);
    }
  }, [tabId, activeTabId]);

  const isMobile = useDetectMobile();
  useBeforeInstallPrompt();
  const { socketInstance, othersDrawings } = useWebSockets(
    setElements,
    collaborators,
    tabId,
    isValidTab
  );
  useDebouncedWs(socketInstance, elements);
  useSendCurrentDrawingElement(socketInstance, element);
  useLocalStorage(setIsLoading, setElements, setShowTutorial);
  const { canvasRef } = useCanvas(elements, element, othersDrawings);

  useEffect(() => {
    const getCollaborators = async () => {
      try {
        const response = await AXIOS_TAB.get(`/${tabId}/detail`);
        setIsValidTab(true);
        setCollaborators(response.data.data.tab.Collaborators);
      } catch (err) {
        if (err instanceof AxiosError)
          console.error(err.response?.data.message);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsTabDataLoading(false);
        setIsValidTab(true);
        navigate("/");
      } finally {
        if (!isValidTab) {
          setIsTabDataLoading(false);
        }
      }
    };
    if (tabId) getCollaborators();
    return () => {};
  }, [navigate, tabId, isValidTab]);

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

  const clearEverything = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    setElements([]);
    localStorage.clear();
    localStorage.setItem("show_tutorial", String(false));
  }, [canvasRef]);

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
    [handleDelete, grabbedElement, elements, clearEverything]
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
    const id = crypto.randomUUID();
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
      setId(id);
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

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (isMobile) {
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

  if (isTabDataLoading && tabId) {
    return (
      <div
        className={`${
          cursorDirection
            ? `cursor-${cursorDirection}`
            : grabbedElement
            ? "cursor-move"
            : "cursor-default"
        } bg-[#dadada] w-screen h-screen flex items-center justify-center`}
        style={{
          backgroundImage:
            "radial-gradient(circle, #cacaca 2px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <h1 className="text-6xl ">Loading...</h1>
      </div>
    );
  }
  if (!isTabDataLoading && !isValidTab && tabId) {
    return (
      <div
        className={`${
          cursorDirection
            ? `cursor-${cursorDirection}`
            : grabbedElement
            ? "cursor-move"
            : "cursor-default"
        } bg-[#dadada] w-screen h-screen flex items-center justify-center flex-col gap-4`}
        style={{
          backgroundImage:
            "radial-gradient(circle, #cacaca 2px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <h1 className="text-6xl">INVALID TAB ID.</h1>
        <span className="text-3xl">Redirecting to the home page...</span>
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
      } bg-[#dadada] `}
      style={{
        backgroundImage:
          "radial-gradient(circle, #cacaca 2px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {!tabId || isLoggedIn ? (
        <nav className="fixed flex  w-full  items-center justify-center">
          <Options
            setShowTutorial={setShowTutorial}
            toggleModal={toggleModal}
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
            clearEverything={clearEverything}
            undo={undo}
          />
        </nav>
      ) : null}

      {tabId && !isLoggedIn ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="filter blur-[8px]"
          ></canvas>
          <div className="absolute w-full h-screen top-0 flex items-center justify-center flex-col gap-10">
            <h1 className="text-6xl text-gray-500">Login to edit this tab</h1>
            <div className={`flex gap-4 ${isLoggedIn && "hidden"}`}>
              <Link
                to="/login"
                className="hover:bg-[#dadada] px-4  p-2 cursor-pointer rounded-md bg-black text-white hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-[#dadada]  p-2 cursor-pointer rounded-sm bg-black text-white hover:text-black"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        ></canvas>
      )}
      {showTutorial && !isLoading && <Tutorial showTutorial={showTutorial} />}

      {isModalOpen && <KeyboardShortcutsModal onClose={toggleModal} />}
      {isLoggedIn && <ControlPanel />}
      {isLoggedIn && <Sidebar />}
    </div>
  );
};

export default WorkSpace;
