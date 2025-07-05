import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { registerSocketHandlers } from './socket/socketHandler.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Pass the `io` instance to socket handler
io.on('connection', (socket) => registerSocketHandlers(io, socket));

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
