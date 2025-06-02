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
}

interface WebSocketWithId extends WebSocket {
  id: string;
}

let elements: Map<string, Element> = new Map();
let currentDrawingElement: Map<string, Element> = new Map();

let connections: WebSocketWithId[] = [];

wss.on("connection", (socket: WebSocketWithId) => {
  socket.id = v4();
  console.log("User connected with id", socket.id);
  connections.push(socket);

  // const arrayfiedElements = Array.from(elements.values());

  socket.send(
    JSON.stringify({
      state: "existing",
      // elements: arrayfiedElements,
      elements,
    })
  );

  socket.on("message", (e) => {
    let msg;
    msg = JSON.parse(e.toLocaleString());

    const id = Object.keys(msg)[0];
    const value = Object.values(msg)[0] as Element;

    if (!id) {
      socket.send("UserId Needed");
      return;
    }

    if (!elements.has(id)) {
      currentDrawingElement.set(id, value);
    }

    elements.set(value.id, value);

    let serializedCurrentDrawingElement = Object.fromEntries(
      currentDrawingElement.entries()
    );

    const message = {
      existingElements: elements,
      drawingElements: serializedCurrentDrawingElement,
    };
    connections.forEach((connection) => {
      if (connection.id != socket.id) {
        connection.send(JSON.stringify(message));
      }
    });
  });

  socket.on("close", () => {
    console.log("User Disconnected");
    connections = connections.filter((connection) => {
      return connection.id != socket.id;
    });
  });
});
