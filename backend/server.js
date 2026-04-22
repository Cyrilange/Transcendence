require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const gameService = require('./services/gameService');
const gameRoutes = require('./routes/games');

const app = express();
const PORT = 3000;


app.use(cors({
  origin: "http://localhost",
  methods: ["GET", "POST"]
}));

app.use(express.json());



// External routes
app.use('/api/games', gameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


// Create game
app.post('/api/games', (req, res) => {
  try {
    const { playerCount, vsComputer, rounds } = req.body;

    if (!playerCount || playerCount < 2 || playerCount > 4) {
      return res.status(400).json({ error: "Invalid player count" });
    }

    const gameId = uuidv4();
    const gameState = gameService.createGame(
      gameId,
      playerCount,
      vsComputer,
      rounds || 5
    );

    res.json({
      success: true,
      gameId,
      initialState: gameState
    });

  } catch (error) {
    console.error("GAME CREATION ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

// Join game
app.post('/api/games/:gameId/join', (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, userData } = req.body;

    const game = gameService.joinGame(gameId, userId, userData);

    io.to(gameId).emit('game_state', game);
    io.to(gameId).emit('player_joined', { userId });

    res.json({ success: true, game });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Play round
app.post('/api/games/:gameId/play-round', (req, res) => {
  try {
    const { gameId } = req.params;
    const { comparisonField = 'points' } = req.body;

    const game = gameService.playRound(gameId, comparisonField);

    io.to(gameId).emit('game_state', game);
    io.to(gameId).emit('round_complete', {
      round: game.currentRound,
      winners: game.roundWinners[game.roundWinners.length - 1]
    });

    res.json({ success: true, game });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//server + socket io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});

//socket
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

    if (!game) {
      return socket.emit('error', { message: 'Game not found' });
    
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

    socket.join(gameId);
    socket.gameId = gameId;

    socket.emit('game_state', game);
    socket.to(gameId).emit('player_joined', { userId: socket.id });

    console.log('User joined game:', gameId);
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

    if (socket.gameId) {
      const game = gameService.getGame(socket.gameId);

      if (game) {
        const index = game.players.findIndex(p => p.socketId === socket.id);

        if (index !== -1) {
          game.players.splice(index, 1);
          io.to(socket.gameId).emit('game_state', game);
        }
      }
    }
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
