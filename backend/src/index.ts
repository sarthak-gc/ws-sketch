import WebSocket, { WebSocketServer } from "ws";
import { v4 } from "uuid";

const wss = new WebSocketServer({ port: 9000 });

wss.on("connection", (socket: WebSocket) => {
  console.log("User connected");

  socket.on("message", (e) => {
    console.log(e.toString());

    socket.send(
      JSON.stringify({
        msg: e.toString(),
        v4,
      })
    );
  });

  socket.on("close", () => {
    console.log("User Disconnected");
  });
});
