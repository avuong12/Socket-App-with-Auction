const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(
  session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: process.env.SESSION_SECRET || 'SocketPractice', // or whatever you like

    // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
    resave: false,
    // this option says if I am new but not modified still save
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.use(express.static(path.join(__dirname + '/../client/')));

const port = 8000;
const server = app.listen(port, function () {
  console.log(`Your server, listening on port ${port}`);
});
const io = require('socket.io')(server);

app.use((req, res, next) => {
  console.log(req.session, `session id: ${req.sessionID}`);
  next(); // needed to continue through express middleware
});

let userNames = new Set();
// For testing. TODO. remember to delete.
userNames.add('angela');
userNames.add('sam');
let socketIdToUsername = { abcdef: 'angela', efghju: 'sam' };
// For testing. TODO. remember to delete.
let chats = [
  { user: 'sam', message: 'hi' },
  { user: 'sam', message: 'test' },
];

function sendHeartbeat() {
  setTimeout(sendHeartbeat, 8000);
  io.emit('ping', { beat: 1 });
}

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('pong', (data) => {
    console.log('Pong received from client');
  });
  // Setting a new user.
  socket.on('set_username', (name) => {
    if (!userNames.has(name)) {
      userNames.add(name);
      socketIdToUsername[socket.id] = name;
      io.emit('set_username', name);
    } else {
      io.emit('set_username', false);
    }
  });

  // Sending a new message.
  socket.on('send_message', (msg) => {
    const chatEntry = { user: socketIdToUsername[socket.id], message: msg };
    chats.push(chatEntry);
    io.emit('send_message', `${socketIdToUsername[socket.id]}: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  // Emits all users connected to socket only to new client when requested.
  socket.on('get_usernames', () => {
    const names = Object.values(socketIdToUsername);
    io.to(socket.id).emit('send_usernames', JSON.stringify(names));
  });

  // Emits chat history only to new client when requested.
  socket.on('get_chat_history', () => {
    io.to(socket.id).emit('send_chat_history', JSON.stringify(chats));
  });
});

setTimeout(sendHeartbeat, 8000);
