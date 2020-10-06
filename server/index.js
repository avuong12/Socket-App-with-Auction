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

let userNames = {};
let socketIds = {};

io.on('connection', (socket) => {
  socket.on('set_username', (name) => {
    if (!userNames.hasOwnProperty(name)) {
      userNames[name] = socket.id;
      socketIds[socket.id] = name;
      io.emit('set_username', name);
    } else {
      io.emit('set_username', false);
    }
  });
  socket.on('send_message', (msg) => {
    io.emit('send_message', `${socketIds[socket.id]}: ${msg}`);
  });
});
