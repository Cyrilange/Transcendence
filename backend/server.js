require('dotenv').config()
const express = require('express')
const session = require('express-session')

const { Server } = require('socket.io');
const cors = require('cors')
const http = require('http')
const gameService = require('./services/gameService')

const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
//app.use('/api/games', gameRoutes);
/* app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
})) */

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:3000", //should be network
    methods: ["GET", "POST"] 
  }
});

app.use('/api/games', require('./routes/games')(io));
app.use('/', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/db', require('./routes/db'))

// Socket.io ServicegameService
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  function triggerBotTurnIfNeeded(gameId, io) {
  const game = gameService.getGame(gameId);

  if (!game || game.status !== 'playing') return;

  const activePlayer = game.players.find(p => p.id === game.activePlayerId);

  if (!activePlayer?.isBot) return; // human's turn, stop

  setTimeout(() => {
    try {
      const updatedGame = gameService.playRound(gameId, null, game.activePlayerId);
      io.to(gameId).emit('game_state', updatedGame);
      triggerBotTurnIfNeeded(gameId, io);
    } catch (err) {
      console.error('Bot turn error:', err.message);
    }
  }, 2500);
}
  socket.on('join_game', (gameId) => {
    const game = gameService.getGame(gameId);
    
    if (game) {
      console.log('Game config on join:', game.config);
      socket.join(gameId);
      socket.gameId = gameId;
      
      console.log('Players on join:', game.players.map(p => ({ id: p.id, handSize: p.hand.length })));

      // Update player socket reference
      const player = game.players.find(p => p.socketId === socket.id);
      if (player) {
        player.socketId = socket.id;
      }
      console.log('User connected to game:', socket.gameId);
      socket.emit('game_state', game);
      socket.to(gameId).emit('player_joined', { userId: socket.id });
    } else {
      socket.emit('error', { message: 'Game not found' });
    }
  });

  socket.on('play_action', ({ gameId, action, comparisonField, playerId  }) => {
    try {
    if (action === 'play_round') {
      console.log('play_action received:', { gameId, comparisonField, playerId });

      const game = gameService.playRound(gameId, comparisonField, playerId);

      if (!game) {
        socket.emit('error', { message: 'playRound returned no game state' });
        return;
      }

      io.to(gameId).emit('game_state', game);
      triggerBotTurnIfNeeded(gameId, io);
    }
  } catch (error) {
    console.error('play_action error:', error);
    socket.emit('error', { message: error.message });
  }
});

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});

app.get('/test', (req, res) => res.send('hello world'))
