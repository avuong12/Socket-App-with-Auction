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

io.on('connection', (socket) => {
  socket.on('send_message', (msg) => {
    io.emit('send_message', msg);
  });
});
