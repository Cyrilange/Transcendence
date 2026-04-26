require('dotenv').config();
 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const session = require('express-session');
 
const gameService = require('./services/gameService');
const db = require('./database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dbRoutes = require('./routes/db');
const matchRoutes = require('./routes/matches');
 
const app = express();
const PORT = process.env.PORT || 3001;
 
const CORS_ORIGINS = [
  "http://localhost",
  "https://localhost",
  /^https?:\/\/172\./,
  /^https?:\/\/10\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/100\./
];
 
app.use(cors({
  origin: CORS_ORIGINS,
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
 
app.use(express.json());
 
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
 
const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});
 
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/games', require('./routes/games')(io));

 
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
 
function updateStats(game) {
  if (game.status !== 'finished') return;
  try {
    if (game.winners && game.winners.length > 1) return;
    const winnerId = game.winner?.id;
    game.players.filter(p => !p.isBot).forEach(player => {
      if (player.id === winnerId) {
        db.prepare('UPDATE users SET wins = wins + 1 WHERE login = ?').run(player.login);
      } else {
        db.prepare('UPDATE users SET losses = losses + 1 WHERE login = ?').run(player.login);
      }
    });
    console.log('Stats updated for game:', game.id);
  } catch (err) {
    console.error('Error updating stats:', err.message);
  }
}
 
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
 
  function triggerBotTurnIfNeeded(gameId) {
    const game = gameService.getGame(gameId);
    if (!game || game.status !== 'playing') return;
 
    const activePlayer = game.players.find(p => p.id === game.activePlayerId);
    if (!activePlayer?.isBot) return;
 
    setTimeout(() => {
      try {
        const updatedGame = gameService.playRound(gameId, null, game.activePlayerId);
        io.to(gameId).emit('game_state', updatedGame);
        if (updatedGame.status === 'finished') updateStats(updatedGame);
        triggerBotTurnIfNeeded(gameId);
      } catch (err) {
        console.error('Bot turn error:', err.message);
      }
    }, 2500);
  }
 
  socket.on('join_game', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    const login = typeof data === 'string' ? null : data.login;
 
    const game = gameService.getGame(gameId);
 
    if (!game) {
      return socket.emit('error', { message: 'Game not found' });
    }
 
    socket.join(gameId);
    socket.gameId = gameId;
 
    const unassigned = game.players.find(p => !p.isBot && !p.socketId);
    if (unassigned) {
      unassigned.socketId = socket.id;
      unassigned.login = login;
      socket.playerId = unassigned.id;
      socket.emit('player_assigned', { playerId: unassigned.id });
      console.log(`Socket ${socket.id} assigned to ${unassigned.id} (login: ${login})`);
    } else {
      const existing = game.players.find(p => p.socketId === socket.id);
      if (existing) {
        socket.playerId = existing.id;
        socket.emit('player_assigned', { playerId: existing.id });
      } else {
        socket.playerId = game.players[0]?.id || 'player_1';
        socket.emit('player_assigned', { playerId: socket.playerId });
      }
    }
 
    socket.emit('game_state', game);
    socket.to(gameId).emit('player_joined', { userId: socket.id });
    triggerBotTurnIfNeeded(gameId);
  });
 
  socket.on('play_action', ({ gameId, action, comparisonField, playerId }) => {
    try {
      if (action === 'play_round') {
        const game = gameService.playRound(gameId, comparisonField, playerId);
        if (!game) {
          socket.emit('error', { message: 'playRound returned no game state' });
          return;
        }
        io.to(gameId).emit('game_state', game);
        if (game.status === 'finished') updateStats(game);
        triggerBotTurnIfNeeded(gameId);
      }
    } catch (error) {
      console.error('play_action error:', error);
      socket.emit('error', { message: error.message });
    }
  });
 
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.gameId) {
      const game = gameService.getGame(socket.gameId);
      if (game) {
        const player = game.players.find(p => p.socketId === socket.id);
        if (player && !player.isBot) player.socketId = null;
        io.to(socket.gameId).emit('game_state', game);
      }
    }
  });
});
 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 