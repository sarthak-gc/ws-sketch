import { useEffect } from "react";
import type { Element } from "../types/types";
import { useUserInfoStore } from "../store/userInfoStore";
import { useTabStore } from "../store/tabStore";

import { useWorkSpaceStore } from "../store/workSpaceStore";

const useSendCurrentMovingElement = (
  socketInstance: React.RefObject<WebSocket | null>,
  element: Element | null,
  x: number,
  y: number
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
      action == "Grabbing"
    ) {
      const width = element.X2 - element.X1;
      const height = element.Y2 - element.Y1;

      const message = {
        type: "move",
        [username]: {
          ...element,
          X1: Math.abs(x - width / 2),
          Y1: Math.abs(y - height / 2),
          X2: Math.abs(x + width / 2),
          Y2: Math.abs(y + height / 2),
        },
        tabId: useTabStore.getState().activeTabId,
        elementId: element.id,
      };
      socket.send(JSON.stringify(message));
    }
  }, [element, socketInstance, action, x, y]);
};

export default useSendCurrentMovingElement;
