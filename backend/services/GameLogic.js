// server/services/gameLogic.js
const  fs = require('fs')
const  path = require('path')
//const { fileURLToPath } = require( 'url') // 1. Import this helper

// 2. Define __dirname and __filename manually
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

class GameLogic {
  constructor() {
    this.games = new Map(); // Store active games
    this.userJsonPath = path.join(__dirname, '../data/user.json')
  }

  // Initialize a new game
  createGame(gameId, playerCount, userJsonPath) {
    const users = this.loadUserJson(userJsonPath);
    const shuffledDeck = this.shuffleDeck(users);
    
    const game = {
      id: gameId,
      status: 'waiting',
      config: { playerCount },
      players: [],
      deck: shuffledDeck,
      currentRound: 0,
      winner: null
    };

    this.games.set(gameId, game);
    return game;
  }

  // Join game and assign cards (30 cards in a deck)
  joinGame(gameId, userId, userData) {
    const game = this.games.get(gameId);
    if (!game || game.players.length >= game.config.playerCount) {
      throw new Error('Game full or not found');
    }

    // Assign next card from deck
    const card = game.deck.pop();
    
    // Parse and validate data types
    const player = {
      id: userId,
      ...userData,
      card: {
        ...card,
        // Ensure numeric fields are integers
        points: parseInt(card.points, 10),
        wallet: parseInt(card.wallet, 10),
        correction_point: parseInt(card.correction_point, 10),
        // Parse dates properly
        pool_month: this.parseDate(card.pool_month),
        pool_year: this.parseDate(card.pool_year)
      }
    };

    game.players.push(player);
    return game;
  }

  // Compare cards and determine round winner
  playRound(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'playing') {
      throw new Error('Invalid game state');
    }

    // Get all players' cards for comparison
    const cards = game.players.map(p => p.card);
    
    // Example: Compare based on points (you can customize this logic)
    const highestPoints = Math.max(...cards.map(c => c.points));
    const winners = game.players.filter(p => p.card.points === highestPoints);

    // Update player stats
    winners.forEach(winner => {
      winner.points += 10; // Award points
    });

    game.currentRound++;
    
    // Check for game end
    if (game.currentRound >= 5) { // Example: 5 rounds
      game.winner = this.determineOverallWinner(game.players);
      game.status = 'finished';
    }

    return game;
  }

  // Helper: Load and parse user.json
  loadUserJson(filePath) {
    const fs = require('fs');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(rawData);
    
    return users.map(user => ({
      ...user,
      points: parseInt(user.points, 10),
      wallet: parseInt(user.wallet, 10),
      correction_point: parseInt(user.correction_point, 10),
      pool_month: this.parseDate(user.pool_month),
      pool_year: this.parseDate(user.pool_year)
    }));
  }

  // Helper: Parse dates safely
  parseDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Helper: Shuffle deck (Fisher-Yates)
  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Helper: Determine overall winner
  determineOverallWinner(players) {
    return players.reduce((winner, player) => 
      player.points > winner.points ? player : winner
    );
  }
}

module.exports =  new GameLogic();
