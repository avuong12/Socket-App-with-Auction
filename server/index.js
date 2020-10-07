const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.use(express.static(path.join(__dirname + '/../client/')));

const port = 8000;
const server = app.listen(port, function () {
  console.log(`Your server, listening on port ${port}`);
});

const io = require('socket.io')(server);

let userNames = { angele: 'wsgh', sam: 'bgeoah' };
let socketIds = {};
let chats = [
  { user: 'sam', message: 'hi' },
  { user: 'sam', message: 'test' },
];

io.on('connection', (socket) => {
  // Emits all users connected to socket.
  const names = Object.keys(userNames);
  io.to(socket.id).emit('send_usernames', JSON.stringify(names));

  // Emits chat history.
  io.to(socket.id).emit('send_chat_history', JSON.stringify(chats));

  // Setting a new user.
  socket.on('set_username', (name) => {
    if (!userNames.hasOwnProperty(name)) {
      userNames[name] = socket.id;
      socketIds[socket.id] = name;
      io.emit('set_username', name);
    } else {
      io.emit('set_username', false);
    }
  });

  // Sending a new message.
  socket.on('send_message', (msg) => {
    const chatEntry = { user: socketIds[socket.id], message: msg };
    chats.push(chatEntry);
    io.emit('send_message', `${socketIds[socket.id]}: ${msg}`);
  });
});
