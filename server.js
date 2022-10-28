// ECMAScript ES6 module
import ws from "ws";
import { v4 as uuid } from "uuid";
const { Server } = ws;
const clients = {}; // Объект клиентов

const wss = new Server({ PORT: 8000 });
wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws; // Сокет соединился с клиентом по ид - новый клиент

  console.log(`New client ${id}`);

  ws.on("message", (rawMessage) => {});

  ws.on("close", () => {
    delete clients[id]; // клиент закрылся
    console.log(`Client is closed ${id}`);
  });
});
