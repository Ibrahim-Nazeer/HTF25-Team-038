const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const sessionsRouter = require('./routes/sessions');
const problemsRouter = require('./routes/problems');
const authRouter = require('./routes/auth');

// API Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO event handlers
const activeRooms = new Map(); // Track active sessions

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join interview session room
  socket.on('join-session', ({ sessionId, userId, userName }) => {
    socket.join(sessionId);
    
    // Track users in room
    if (!activeRooms.has(sessionId)) {
      activeRooms.set(sessionId, new Set());
    }
    activeRooms.get(sessionId).add({ socketId: socket.id, userId, userName });

    // Notify others in the room
    socket.to(sessionId).emit('user-joined', { userId, userName });
    
    console.log(`User ${userName} joined session ${sessionId}`);
  });

  // Code editor synchronization
  socket.on('code-change', ({ sessionId, code, language }) => {
    socket.to(sessionId).emit('code-update', { code, language });
  });

  // Cursor position tracking
  socket.on('cursor-position', ({ sessionId, position, userId }) => {
    socket.to(sessionId).emit('cursor-moved', { position, userId });
  });

  // Whiteboard synchronization
  socket.on('whiteboard-change', ({ sessionId, drawingData }) => {
    socket.to(sessionId).emit('whiteboard-update', { drawingData });
  });

  // Chat messages
  socket.on('chat-message', ({ sessionId, message, userId, userName }) => {
    const timestamp = new Date().toISOString();
    io.to(sessionId).emit('chat-message', { 
      message, 
      userId, 
      userName, 
      timestamp 
    });
  });

  // Timer synchronization
  socket.on('timer-start', ({ sessionId, duration }) => {
    io.to(sessionId).emit('timer-started', { duration, startTime: Date.now() });
  });

  socket.on('timer-pause', ({ sessionId }) => {
    io.to(sessionId).emit('timer-paused', { pauseTime: Date.now() });
  });

  socket.on('timer-reset', ({ sessionId }) => {
    io.to(sessionId).emit('timer-reset');
  });

  // Leave session
  socket.on('leave-session', ({ sessionId, userId }) => {
    socket.leave(sessionId);
    
    if (activeRooms.has(sessionId)) {
      const room = activeRooms.get(sessionId);
      room.forEach(user => {
        if (user.socketId === socket.id) {
          room.delete(user);
        }
      });
    }
    
    socket.to(sessionId).emit('user-left', { userId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Clean up from all rooms
    activeRooms.forEach((users, sessionId) => {
      users.forEach(user => {
        if (user.socketId === socket.id) {
          users.delete(user);
          io.to(sessionId).emit('user-left', { userId: user.userId });
        }
      });
    });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
});