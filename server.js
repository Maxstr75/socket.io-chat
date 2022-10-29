const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

server.listen(process.env.PORT || 3000, function () {
  console.log("Server running in port 3000");
});

app.use(express.static(__dirname + "/public"));

// Подключаемые пользователи
const users = {};

// Все работа чата будет заключена внутри этой конструкции:
// Этот код выполнится для каждого вновь подключаемого пользователя по событию connection.
io.sockets.on("connection", (client) => {
  // Это функция выполняет событие event и
  // пересылает данные data конкретно для текущего пользователя client.emit(event, data),
  //  а после инициирует событие для всех остальных подключившихся пользователей client.broadcast.emit(event, data)
  const broadcast = (event, data) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  };
  broadcast("user", users); //При первом подключении пользователя мы выполняем событие user и сообщаем всем участникам чата, наш текущий список пользователей

  // Отправка сообщения
  client.on("message", (message) => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast("user", users);
    }
    broadcast("message", message);
  });
  // Пользователь вышел из чата
  client.on("disconnect", () => {
    delete users[client.id];
    client.broadcast.emit("user", users);
  });
});
