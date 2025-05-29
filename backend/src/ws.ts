import WebSocket, { WebSocketServer } from "ws";
import { v4 } from "uuid";

const wss = new WebSocketServer({ port: 9000 });
interface Element {
  shape: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  id: string;
}
let elements: Element[] = [];

let connections: WebSocket[] = [];

console.log(elements);
wss.on("connection", (socket: WebSocket) => {
  console.log("User connected");
  connections.push(socket);
  socket.on("message", (e) => {
    elements = JSON.parse(e.toString());
    console.log(elements);
    connections.forEach((connection) => {
      connection.send(JSON.stringify(elements));
    });
  });

  socket.on("close", () => {
    console.log("User Disconnected");
    connections = connections.filter((connection) => {
      return connection != socket;
    });
  });
});
