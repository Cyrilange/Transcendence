const express =  require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
//const axios = require('axios');
const gameService = require('../services/gameService.js')
//const apiService = require('../callApi.js');

module.exports = (io) => {

  // Create game
  router.post('/', async (req, res) => {
    try {
      const { playerCount, vsComputer, rounds, gameType, difficulty  } = req.body;

      if (!playerCount || playerCount < 2 || playerCount > 4) {
        return res.status(400).json({ error: 'Invalid player count' });
      }

      const gameId = uuidv4();
      const gameState =  await gameService.createGame(gameId, playerCount, vsComputer, rounds, gameType, difficulty );

      console.log('Game created:', { gameId, playerCount, vsComputer, rounds, gameType });

      res.json({ success: true, gameId, initialState: gameState });
    } catch (error) {
      console.error('GAME CREATION ERROR:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });
/*   //just to see our campus id
  router.get('/campuses', async (req, res) => {
    try {
      const token = await apiService.getToken();
      const response = await axios.get(`${process.env.FORTY_TWO_API_URL}/v2/campus/37/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 'page[size]': 100 }
      });

      // Log to server terminal for easy reading
      console.log('Campuses:');
      response.data.forEach(c => console.log(`  ${c.id} — ${c.name} (${c.country})`));

      res.json(response.data);
    } catch (error) {
      console.error('Campus fetch error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
 */
  // Join game
  router.post('/:gameId/join', async (req, res) => {
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
  router.post('/:gameId/play-round', async (req, res) => {
    try {
      const { gameId } = req.params;
      const { comparisonField = 'correction_point' } = req.body;

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

  // Get game state
  router.get('/:gameId', (req, res) => {
    try {
      const { gameId } = req.params;
      const game = gameService.getGame(gameId);

      if (!game) return res.status(404).json({ error: 'Game not found' });

      res.json({ success: true, game });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};