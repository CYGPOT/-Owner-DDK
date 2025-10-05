const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const OWNER_NAME = 'owner'; // 擁有者暱稱
const OWNER_PASSWORD = 'tkpms770'; // 擁有者密碼

app.use(express.static('public'));

io.on('connection', (socket) => {
  let username = '';
  let isOwner = false;

  socket.on('set username', ({ name, password }) => {
    username = name;
    if (name === OWNER_NAME && password === OWNER_PASSWORD) {
      isOwner = true;
    }
    socket.emit('username set', { success: true, isOwner });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      user: username,
      msg,
      isOwner
    });
  });

  socket.on('disconnect', () => {
    // 可選：通知離線
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://localhost:${PORT} or http://<你的IP>:${PORT}`);
});
