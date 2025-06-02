import { useEffect, type RefObject } from "react";
import type { Element } from "../types/types";

const useDebouncedWs = (
  socketInstance: RefObject<WebSocket | null>,
  elements: Element[]
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const socket = socketInstance.current;

      if (socket && elements) {
        // socket.send(JSON.stringify(elements));
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [elements, socketInstance]);
};

export default useDebouncedWs;
