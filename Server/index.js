import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Server } from 'socket.io';
const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
const io = new Server(expressServer, { 
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false: ['http://localhost:5500', 'http://127.0.0.1:5500']
  }
});
io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  //upon connection -on;y to user

  socket.emit('message', 'Welcome to the chat App');

  //broadcast to all users except the user

  socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`);

  //listen for messages

  socket.on('message', data => {
    console.log(data);
    io.emit('message', `${socket.id.substring(0, 5)}:${data}`);
  });

  // when user disconnets - broadcast to all users

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`);
  });

  // Listen for activity
  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name);
  });
});

