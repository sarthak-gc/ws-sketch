import { useEffect, useRef, useState } from "react";
import { userUserInfoStore } from "../store/userInfoStore";
import type { Element } from "../types/types";

const useWebSockets = () => {
  const [othersDrawing, setOthersDrawing] = useState<Element>();
  const socketInstance = useRef<WebSocket | null>(null);

  useEffect(() => {
    const isLoggedIn = userUserInfoStore.getState().isLoggedIn;

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
          // ! ----------------------------------
          setOthersDrawing(elem.drawingElements["sarthakgc"]);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socketInstance, othersDrawing };
};

export default useWebSockets;
