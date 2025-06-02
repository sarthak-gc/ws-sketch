import { useEffect } from "react";
import type { Element } from "../types/types";
import { useUserInfoStore } from "../store/userInfoStore";

const useSendCurrentDrawingElement = (
  socketInstance: React.RefObject<WebSocket | null>,
  element: Element | null
) => {
  useEffect(() => {
    const username = useUserInfoStore.getState().user?.username;
    const socket = socketInstance.current;

    if (socket && element && socket.readyState === WebSocket.OPEN && username) {
      const message = {
        [username]: element,
      };

      socket.send(JSON.stringify(message));
    }
  }, [element, socketInstance]);
};

export default useSendCurrentDrawingElement;
