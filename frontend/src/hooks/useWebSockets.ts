import { useEffect, useRef, useState, type SetStateAction } from "react";
import { useUserInfoStore } from "../store/userInfoStore";
import type { Collaborator, Element } from "../types/types";

const useWebSockets = (
  setElements: React.Dispatch<SetStateAction<Element[]>>,
  collaborators: Collaborator[],
  tabId: string | undefined,
  isValidTab: boolean,
  locked: boolean
) => {
  const [othersDrawings, setOthersDrawings] = useState<Element[]>([]);
  const socketInstance = useRef<WebSocket | null>(null);

  useEffect(() => {
    const isLoggedIn = useUserInfoStore.getState().isLoggedIn;
    if (
      !isLoggedIn ||
      !tabId ||
      !isValidTab ||
      collaborators.length == 0 ||
      locked
    ) {
      return;
    }

    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    socketInstance.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          tabId,
        })
      );
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
            Object.values(elem.existingElements || {})
          );
          setElements((prev) => {
            const allElements = [...prev, ...existingElements];
            const uniqueById = Array.from(
              new Map(allElements.map((item) => [item.id, item])).values()
            );
            return uniqueById;
          });

          if (elem.type === "move") {
            const movingElement: Element[] = Array.from(
              Object.values(elem.movingElement || {})
            );

            setElements((prev) => {
              const allElements = [...prev, ...movingElement];
              const uniqueById = Array.from(
                new Map(allElements.map((item) => [item.id, item])).values()
              );
              return uniqueById;
            });
          } else if (elem.type === "draw") {
            const drawingElements: Element[] = Array.from(
              Object.values(elem.drawingElements || {})
            );
            setOthersDrawings(drawingElements);
          }
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [setElements, collaborators, tabId, isValidTab, locked]);

  return { socketInstance, othersDrawings };
};

export default useWebSockets;
