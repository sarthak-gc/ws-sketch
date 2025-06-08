import { useEffect } from "react";
import type { Element } from "../types/types";
import { useUserInfoStore } from "../store/userInfoStore";
import { useTabStore } from "../store/tabStore";
import { useWorkSpaceStore } from "../store/workSpaceStore";

const useSendCurrentResizingElement = (
  socketInstance: React.RefObject<WebSocket | null>,
  element: Element | null,
  x: number,
  y: number,
  cornerSide: {
    corner?: string;
    side?: string;
  } | null,
  elements: Element[]
) => {
  const action = useWorkSpaceStore.getState().action;

  useEffect(() => {
    const username = useUserInfoStore.getState().user?.username;
    const socket = socketInstance.current;

    if (
      socket &&
      element &&
      socket.readyState === WebSocket.OPEN &&
      username &&
      action === "Resizing"
    ) {
      if (!cornerSide) {
        return;
      }

      let newEl: Element | null = null;
      if (element.shape === "Line") {
        if (cornerSide.side === "TOP") {
          newEl = { ...element, X1: x, Y1: y };
        } else if (cornerSide.side === "Bottom") {
          newEl = { ...element, X2: x, Y2: y };
        }
      } else if (element.shape === "Rectangle") {
        if (cornerSide.corner === "TopLeft") {
          newEl = { ...element, X1: x, Y1: y };
        } else if (cornerSide.corner === "TopRight") {
          newEl = { ...element, Y1: y, X2: x };
        } else if (cornerSide.corner === "BottomLeft") {
          newEl = { ...element, X1: x, Y2: y };
        } else if (cornerSide.corner === "BottomRight") {
          newEl = { ...element, X2: x, Y2: y };
        }
      }

      if (newEl) {
        const message = {
          type: "resize",
          [username]: { ...newEl },
          tabId: useTabStore.getState().activeTabId,
          elementId: element.id,
        };
        socket.send(JSON.stringify(message));
      }
    }
  }, [element, socketInstance, action, x, y, cornerSide, elements]);
};

export default useSendCurrentResizingElement;
