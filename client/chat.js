const socket = io();

function loadChatApp() {
  const username = document.getElementById('username');
  username.onsubmit = chooseUsername;
  const message = document.getElementById('message-form');
  message.onsubmit = sendMessage;

  socket.on('send_message', addMessage);
  socket.on('set_username', addUserName);
}

function sendMessage(event) {
  event.preventDefault();
  let inputMessage = document.getElementById('m');
  // send the message to the sever. Give it a "route".
  socket.emit('send_message', inputMessage.value);
  // clear the text block on the DOM.
  inputMessage.value = '';
  return false;
}

function addMessage(message) {
  const messages = document.getElementById('messages');
  const newMessage = document.createElement('li');
  newMessage.innerHTML = message;
  messages.appendChild(newMessage);
}

function chooseUsername(event) {
  event.preventDefault();
  let inputUsername = document.getElementById('name');
  socket.emit('set_username', inputUsername.value);
  inputUsername.value = '';
  return false;
}

function addUserName(name) {
  if (name === false) {
    window.alert('Username already taken. Try again!');
    return false;
  }
  const usernames = document.getElementById('users');
  const newUsername = document.createElement('li');
  newUsername.innerHTML = name;
  usernames.appendChild(newUsername);
}
