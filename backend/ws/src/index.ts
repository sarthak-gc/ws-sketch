import WebSocket, { WebSocketServer } from "ws";
import { v4 } from "uuid";

const port = Number(process.env.PORT) || 9000;
const wss = new WebSocketServer({ port });
interface Element {
  shape: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  id: string;
  color: string;
}

interface WebSocketWithId extends WebSocket {
  id: string;
}

interface ConnectionI {
  [tabId: string]: WebSocketWithId[];
}

let elements: Map<string, Map<string, Element>> = new Map();
let currentDrawingElement: Map<string, Element> = new Map();
let currentMovingElement: Map<string, Element> = new Map();
let currentResizingElement: Map<string, Element> = new Map();

let connections: ConnectionI = {};

wss.on("connection", (socket: WebSocketWithId) => {
  socket.id = v4();
  console.log("User connected with id", socket.id);

  socket.on("message", (e) => {
    let msg;
    msg = JSON.parse(e.toLocaleString());

    if (msg.type == "draw") {
      const username = Object.keys(msg)[1];
      const value = Object.values(msg)[1] as Element;

      if (!username) {
        socket.send("username Needed");
        return;
      }

      if (!elements.has(username)) {
        currentDrawingElement.set(username, value);
      }

      if (!elements.has(msg.tabId)) {
        elements.set(msg.tabId, new Map());
      }
      elements.get(msg.tabId)?.set(value.id, value);

      let serializedCurrentDrawingElement = Object.fromEntries(
        currentDrawingElement.entries()
      );

      const message = {
        type: "draw",
        existingElements: elements,
        drawingElements: serializedCurrentDrawingElement,
      };

      connections[msg.tabId].forEach((connection) => {
        if (connection.id != socket.id) {
          connection.send(JSON.stringify(message));
        }
      });
    }

   if (msg.type == "join") {
      socket.send(
        JSON.stringify({
          existingElements: Object.fromEntries(
            elements.get(msg.tabId)?.entries() ?? []
          ),
        })
      );
      if (!connections[msg.tabId]) {
        connections[msg.tabId] = [];
      }
      connections[msg.tabId].push(socket);
    }

    if (msg.type == "resize") {
      const username = Object.keys(msg)[1];
      const value = Object.values(msg)[1] as Element;

      if (!username) {
        socket.send("username Needed");
        return;
      }

      currentResizingElement.set(username, value);

      if (!elements.has(msg.tabId)) {
        elements.set(msg.tabId, new Map());
      }
      elements.get(msg.tabId)?.set(value.id, value);

      let serializedCurrentResizingElement = Object.fromEntries(
        currentResizingElement.entries()
      );
      const message = {
        type: "resize",
        resizingElement: serializedCurrentResizingElement,
      };
      connections[msg.tabId].forEach((connection) => {
        if (connection.id != socket.id) {
          connection.send(JSON.stringify(message));
        }
      });
    }

    if (msg.type == "move") {
      const elementId = msg.elementId;
      const value = Object.values(msg)[1] as Element;
      if (!elementId) {
        socket.send("elementId Needed");
        return;
      }

      currentMovingElement.set(elementId, value);

      if (!elements.has(msg.tabId)) {
        elements.set(msg.tabId, new Map());
      }
      elements.get(msg.tabId)?.set(value.id, value);
      let serializedCurrentMovingElement = Object.fromEntries(
        currentMovingElement.entries()
      );
      const message = {
        type: "move",
        movingElement: serializedCurrentMovingElement,
      };

      connections[msg.tabId].forEach((connection) => {
        if (connection.id != socket.id) {
          connection.send(JSON.stringify(message));
        }
      });
    }
  });

  socket.on("close", () => {
    for (const tabId in connections) {
      connections[tabId] = connections[tabId].filter(
        (conn) => conn.id !== socket.id
      );
    }
  });
});
