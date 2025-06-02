import { useEffect, useRef, useState, type SetStateAction } from "react";
import { useUserInfoStore } from "../store/userInfoStore";
import type { Element } from "../types/types";

const useWebSockets = (
  setElements: React.Dispatch<SetStateAction<Element[]>>
) => {
  const [othersDrawings, setOthersDrawings] = useState<Element[]>([]);
  const socketInstance = useRef<WebSocket | null>(null);

  useEffect(() => {
    const isLoggedIn = useUserInfoStore.getState().isLoggedIn;

    if (!isLoggedIn) {
      return;
    }

    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    socketInstance.current = ws;

    ws.onopen = () => {
      // ws.send(JSON.stringify({}));
      console.log("connection established");
    };

    ws.onmessage = (e) => {
      let elem;
      try {
        elem = JSON.parse(e.data);
      } catch (err) {
        const x = err;
        JSON.stringify(x);
        elem = e.data;
      } finally {
        if (elem != "UserId Needed") {
          const existingElements: Element[] = Array.from(
            Object.values(elem.existingElements)
          );

          const drawingElements: Element[] = Array.from(
            Object.values(elem.drawingElements || {})
          );
          console.log(drawingElements);

          setElements((prev) => {
            return [...prev, ...existingElements];
          });
          setOthersDrawings(drawingElements);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [setElements]);

  return { socketInstance, othersDrawings };
};

export default useWebSockets;
