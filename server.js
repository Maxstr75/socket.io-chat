const WebSocketServer = new require("ws");

const wss = new WebSocketServer.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Hoвoe соединение");
});
