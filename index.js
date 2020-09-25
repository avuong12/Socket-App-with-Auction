const app = require('express')();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 8000;
const server = app.listen(port, function () {
  console.log(`Your server, listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('a user connection');
});
