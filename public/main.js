//Cобираем в переменные все необходимые нам DOM элементы
const usersList = document.getElementById("users");
const board = document.getElementById("board");
const userMessage = document.getElementById("msg_txt");
const userName = document.getElementById("msg_name");
const sendButton = document.getElementById("msg_btn");

const socket = io(); //Подключаем экземпляр socket.io
const message = []; //Массив для хранения полученных от сервера сообщений
const LIMIT_MESSAGES = 10; //Лимит на максимальное количество сообщений на экране

const render = (body, elements) => {
  body.innerHTML = "";
  const fragment = document.createDocumentFragment();

  elements.forEach((element) => {
    fragment.appendChild(element);
  });

  body.appendChild(fragment);
};

const renderListOfMessages = ({ name, message }) => {
  const divName = document.createElement("DIV");
  divName.className = "alert alert-primary col-md-3";
  divName.textContent = name;

  const divMessage = document.createElement("DIV");
  divMessage.className = "alert alert-dark col-md-9";
  divMessage.textContent = message;

  const divWrapper = document.createElement("DIV");
  divWrapper.className = "row";

  divWrapper.appendChild(divName);
  divWrapper.appendChild(divMessage);

  if (messages.unshift(divWrapper) > LIMIT_MESSAGES) {
    messages.pop();
  }

  render(board, messages);
};

const renderListOfUsers = (data) => {
  const userElement = Object.values(data).map((user) => {
    const li = document.createElement("LI");
    li.classList.add("list-group-item");
    li.textContent = user;
    return li;
  });
  render(usersList, userElement);
};

// Отправка сообщения на сервер
const sendUserMessage = () => {
  let name = userName.value;
  const message = userMessage.value;

  if (message === "" || name === "") {
    return;
  }

  socket.emit("message", {
    message,
    name,
  });

  userMessage.value = "";
  userMessage.focus();
};

//Вызывает функцию sendUserMessage если мы нажимаем клавишу Enter
const pressEnterKey = (e) => {
  if (e.keyCode === 13) {
    sendUserMessage();
  }
};

sendButton.addEventListener("click", sendUserMessage);
userMessage.addEventListener("keyup", pressEnterKey);

socket.on("user", renderListOfUsers); //Каждый раз при получении события message выводит обновленный список сообщений пользователей на странице
socket.on("message", renderListOfMessages); //Каждый раз при получении события user выводит обновленный список пользователей на странице
