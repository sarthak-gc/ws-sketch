import { useEffect, useRef } from "react";
import { useUserInfoStore } from "../store/userInfoStore";
import type { Collaborator, Element } from "../types/types";
import { useWorkSpaceStore } from "../store/workSpaceStore";

const useWebSockets = (
  collaborators: Collaborator[],
  tabId: string | undefined,
  isValidTab: boolean,
  locked: boolean
) => {
  // const [othersDrawings, setOthersDrawings] = useState<Element[]>([]);
  const socketInstance = useRef<WebSocket | null>(null);
  const setElements = useWorkSpaceStore().setElements;
  const elements = useWorkSpaceStore().elements;
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
          const allElements = [...elements, ...existingElements];

          const uniqueById = Array.from(
            new Map(allElements.map((item) => [item.id, item])).values()
          );
          setElements(uniqueById);

          if (elem.type === "move") {
            const movingElement: Element[] = Array.from(
              Object.values(elem.movingElement || {})
            );
            const allElements = [...elements, ...movingElement];
            const uniqueById = Array.from(
              new Map(allElements.map((item) => [item.id, item])).values()
            );
            setElements(uniqueById);
          } else if (elem.type === "draw") {
            const drawingElements: Element[] = Array.from(
              Object.values(elem.drawingElements || {})
            );
            const allElements = [...elements, ...drawingElements];
            const uniqueById = Array.from(
              new Map(allElements.map((item) => [item.id, item])).values()
            );
            // setOthersDrawings(drawingElements);
            setElements(uniqueById);
          } else if (elem.type === "resize") {
            const resizingElement: Element[] = Array.from(
              Object.values(elem.resizingElement || {})
            );
            const allElements = [...elements, ...resizingElement];

            const uniqueById = Array.from(
              new Map(allElements.map((item) => [item.id, item])).values()
            );
            setElements(uniqueById);
          }
        }
      }
    };
    return () => {
      ws.close();
    };
  }, [setElements, collaborators, tabId, isValidTab, locked, elements]);

  // return { socketInstance, othersDrawings };
  return { socketInstance };
};

export default useWebSockets;
