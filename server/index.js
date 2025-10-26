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
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174', // Alternate port
      'http://localhost:5175', // Another alternate
      'https://htf-25-team-038.vercel.app', // Production frontend
      'https://htf-25-team-038-k5ih-fzfny24gj.vercel.app', // Preview deployment
      'https://htf-25-team-038-k-git-0b35f0-syedibrahimnazeer30-1477s-projects.vercel.app' // Git preview
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://htf-25-team-038.vercel.app',
    'https://htf-25-team-038-k5ih-fzfny24gj.vercel.app',
    'https://htf-25-team-038-k-git-0b35f0-syedibrahimnazeer30-1477s-projects.vercel.app'
  ],
  credentials: true
}));
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
    console.log(`📝 Code change in session ${sessionId}, language: ${language}, code length: ${code?.length}`);
    socket.to(sessionId).emit('code-update', { code, language });
  });

  // Cursor position tracking
  socket.on('cursor-position', ({ sessionId, position, userId }) => {
    socket.to(sessionId).emit('cursor-moved', { position, userId });
  });

  // Whiteboard synchronization
  socket.on('whiteboard-change', ({ sessionId, drawingData }) => {
    console.log(`🎨 Whiteboard change in session ${sessionId}`);
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

  // End session
  socket.on('end-session', ({ sessionId }) => {
    io.to(sessionId).emit('session-ended');
    console.log(`Session ${sessionId} ended`);
  });

  // Change problem
  socket.on('change-problem', ({ sessionId, problem }) => {
    socket.to(sessionId).emit('problem-changed', { problem });
    console.log(`Problem changed in session ${sessionId} to ${problem.title}`);
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