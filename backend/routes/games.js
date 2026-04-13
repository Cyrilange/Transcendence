const express =  require('express')
const { v4: uuidv4 } = require('uuid');
const gameService = require('../services/gameService.js')

const router = express.Router();

// Create game
router.post('/', (req, res) => {
  try {
    const { playerCount, vsComputer, rounds } = req.body;
    const gameId = uuidv4();
    
    const game = gameService.createGame(gameId, playerCount, vsComputer, rounds);
    
    res.json({ gameId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join game
router.post('/:gameId/join', (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, userData } = req.body;
    
    const game = gameService.joinGame(gameId, userId, userData);
    
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Play round
router.post('/:gameId/round', (req, res) => {
  try {
    const { gameId } = req.params;
    const { comparisonField = 'points' } = req.body;
    
    const game = gameService.playRound(gameId, comparisonField);
    
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get game state
router.get('/:gameId', (req, res) => {
  const game = gameService.getGame(req.params.gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json(game);
});

module.exports = router