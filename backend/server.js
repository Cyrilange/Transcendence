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

  socket.on('join_game', (gameId) => {
    const game = gameService.getGame(gameId);

    if (!game) {
      return socket.emit('error', { message: 'Game not found' });
    }

    socket.join(gameId);
    socket.gameId = gameId;

    socket.emit('game_state', game);
    socket.to(gameId).emit('player_joined', { userId: socket.id });

    console.log('User joined game:', gameId);
  });

  socket.on('play_action', ({ gameId, action, comparisonField }) => {
    try {
      let game;

      if (action === 'play_round') {
        game = gameService.playRound(gameId, comparisonField);
      }

      io.to(gameId).emit('game_state', game);

    } catch (error) {
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