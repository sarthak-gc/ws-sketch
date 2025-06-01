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

interface currentDrawingElementI {
  [key: string]: {
    element: Element;
  };
}

interface WebSocketWithId extends WebSocket {
  id: string;
}

let elements: Element[]; // everything on the canvas

let currentDrawingElement: Map<string, currentDrawingElementI> = new Map(); // one element that the user is drawing, to share it with other collaborators

let connections: WebSocketWithId[] = [];

wss.on("connection", (socket: WebSocketWithId) => {
  socket.id = v4();
  console.log("User connected with id", socket.id);
  connections.push(socket);
  socket.on("message", (e) => {
    let msg: currentDrawingElementI;
    msg = JSON.parse(e.toLocaleString());
    let keys = Object.keys(msg);

    let key = keys[0];
    if (!key) {
      socket.send("UserId Needed");
      return;
    }

    let value = msg[key];
    if (key) {
      currentDrawingElement.set(key, { element: value });
    }

    let serializedCurrentDrawingElement = Object.fromEntries(
      currentDrawingElement.entries()
    );

    connections.forEach((connection) => {
      if (connection.id != socket.id) {
        connection.send(JSON.stringify(serializedCurrentDrawingElement));
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
