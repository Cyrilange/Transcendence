// server/services/gameService.js
const  fs = require('fs')
const  path = require('path')
//import { fileURLToPath } from 'url'; // 1. Import this helper

// 2. Define __dirname and __filename manually
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

class GameService {
  constructor() {
    this.games = {};
    this.userJsonPath = path.join(__dirname, '../data/user.json');
  }

  // Load and parse user.json with proper types
  loadUserDeck() {
    try {
      const rawData = fs.readFileSync(this.userJsonPath, 'utf8');
      const users = JSON.parse(rawData);
      
      return users.map(user => ({
        ...user,
        // Ensure numeric fields are integers
        points: parseInt(user.points, 10) || 0,
        wallet: parseInt(user.wallet, 10) || 0,
        correction_point: parseInt(user.correction_point, 10) || 0,
        // Parse dates properly
        pool_month: this.parseDate(user.pool_month),
        pool_year: this.parseDate(user.pool_year)
      }));
    } catch (error) {
      console.error('Error loading user.json:', error);
      return [];
    }
  }

  // Parse dates safely
  parseDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Fisher-Yates shuffle algorithm
  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Create new game
  createGame(gameId, playerCount, vsComputer, rounds) {
    const deck = this.loadUserDeck();
    const shuffledDeck = this.shuffleDeck(deck);

    const gameState = {
      id: gameId,
      status: 'waiting',
      config: { playerCount, vsComputer, rounds },
      players: [],
      deck: shuffledDeck,
      currentRound: 0,
      roundWinners: [],
      winner: null,
      createdAt: new Date().toISOString()
    };

    this.games[gameId] = gameState;
    return gameState;
  }

  // Join game and assign card
  joinGame(gameId, userId, userData) {
    const game = this.games[gameId];
    
    if (!game) {
      throw new Error('Game not found');
    }
    
    if (game.status !== 'waiting') {
      throw new Error('Game already started');
    }
    
    if (game.players.length >= game.config.playerCount) {
      throw new Error('Game is full');
    }

    // Assign next card from deck
    const card = game.deck.pop();
    
    if (!card) {
      throw new Error('Not enough cards in deck');
    }

    const player = {
      id: userId,
      socketId: null, // Will be set later
      ...userData,
      card: {
        ...card,
        // Ensure types are correct
        points: parseInt(card.points, 10) || 0,
        wallet: parseInt(card.wallet, 10) || 0,
        correction_point: parseInt(card.correction_point, 10) || 0,
        pool_month: this.parseDate(card.pool_month),
        pool_year: this.parseDate(card.pool_year)
      },
      roundWins: 0,
      totalPoints: 0
    };

    game.players.push(player);
    
    // Auto-start if all players joined
    if (game.players.length === game.config.playerCount) {
      game.status = 'ready';
    }

    return game;
  }

  // Compare two cards
  compareCards(card1, card2, comparisonField = 'points') {
    const values = {
      points: card1.points - card2.points,
      wallet: card1.wallet - card2.wallet,
      correction_point: card1.correction_point - card2.correction_point,
      pool_year: (card1.pool_year?.getTime() || 0) - (card2.pool_year?.getTime() || 0),
      pool_month: (card1.pool_month?.getTime() || 0) - (card2.pool_month?.getTime() || 0)
    };

    return values[comparisonField];
  }

  // Play a round
  playRound(gameId, comparisonField = 'points') {
    const game = this.games[gameId];
    
    if (!game || game.status !== 'ready') {
      throw new Error('Game not ready to play');
    }

    // Find winner based on comparison field
    const sortedPlayers = [...game.players].sort((a, b) => 
      this.compareCards(b.card, a.card, comparisonField)
    );
    
    const winningPlayer = sortedPlayers[0];
    const winningValue = winningPlayer.card[comparisonField];
    
    // Check for ties
    const winners = sortedPlayers.filter(p => 
      p.card[comparisonField] === winningValue
    );

    // Award points to winners
    winners.forEach(winner => {
      winner.roundWins += 1;
      winner.totalPoints += 10;
    });

    game.roundWinners.push({
      round: game.currentRound + 1,
      winners: winners.map(w => w.id),
      comparisonField,
      winningValue
    });

    game.currentRound += 1;

    // Check if game should end
    if (game.currentRound >= game.config.rounds) {
      this.endGame(gameId);
    }

    return game;
  }

  // End game and determine overall winner
  endGame(gameId) {
    const game = this.games[gameId];
    
    const sortedByPoints = [...game.players].sort((a, b) => 
      b.totalPoints - a.totalPoints
    );
    
    game.winner = sortedByPoints[0];
    game.status = 'finished';
    
    return game;
  }

  // Get game state
  getGame(gameId) {
    return this.games[gameId] || null;
  }

  // Remove game
  removeGame(gameId) {
    delete this.games[gameId];
  }
}
module.exports = new GameService();