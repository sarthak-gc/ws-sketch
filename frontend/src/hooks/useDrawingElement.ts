import { useEffect } from "react";
import type { Element } from "../types/types";
import { useUserInfoStore } from "../store/userInfoStore";
import { useTabStore } from "../store/tabStore";

const useSendCurrentDrawingElement = (
  socketInstance: React.RefObject<WebSocket | null>,
  element: Element | null
) => {
  useEffect(() => {
    const username = useUserInfoStore.getState().user?.username;
    const socket = socketInstance.current;
    const hexCode = useUserInfoStore.getState().user?.hexCode;
    if (socket && element && socket.readyState === WebSocket.OPEN && username) {
      const message = {
        type: "draw",
        [username]: { ...element, color: hexCode },
        tabId: useTabStore.getState().activeTabId,
      };

      socket.send(JSON.stringify(message));
    }
  }, [element, socketInstance]);
};

export default useSendCurrentDrawingElement;
