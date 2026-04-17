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
      console.log('GameService instance created'); // ← add this
  }

  // Load and parse user.json with proper types
  loadUserDeck() {
    try {
      const rawData = fs.readFileSync(this.userJsonPath, 'utf8');
      const users = JSON.parse(rawData);
      
      return users.map(user => ({
        ...user,
        // Ensure numeric fields are integers
        points: parseInt(0) || 0,
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

  dealHands(players, deck, playerCount) {
  const cardsPerPlayer = Math.floor(30 / playerCount);

  players.forEach((player, i) => {
     // Slice the deck for this player
      player.hand = deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer);
      // Ensure numeric types for the cards in the hand
      player.hand = player.hand.map(card => ({
        ...card,
        points: parseInt(0) || 0,
        wallet: parseInt(card.wallet, 10) || 0,
        correction_point: parseInt(card.correction_point, 10) || 0,
        pool_month: this.parseDate(card.pool_month),
        pool_year: this.parseDate(card.pool_year)
      }));
    });

  return players;
}
//Error: Cannot read properties of undefined (reading 'hand')
//Error: Cannot read properties of undefined (reading 'id')
  // Create new game
  createGame(gameId, playerCount, vsComputer, rounds) {
    const deck = this.loadUserDeck();
    const shuffledDeck = this.shuffleDeck(deck);

    // Create playerCount placeholder players
    const players = Array.from({ length: playerCount }, (_, i) => ({
      id: `player_${i + 1}`,
      name: `Player ${i + 1}`,
      hand: [],
      roundWins: 0,
      socketId: null // To track who is connected
    }));
    this.dealHands(players, shuffledDeck, playerCount);

    const gameState = {
      id: gameId,
      //status: 'waiting',
      status: 'playing',
      config: { playerCount, vsComputer, rounds },
     // players: [],
      players,
      deck: shuffledDeck,
      pile: [],  
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
    
    if (!game) throw new Error('Game not found');
    if (game.status !== 'waiting') throw new Error('Game already started');
    if (game.players.length >= game.config.playerCount) throw new Error('Game is full');
    

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
        points: parseInt(0) || 0,
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
  compareCards(card1, card2, comparisonField = 'correction_point') {
    const values = {
     // points: card1.points - card2.points,
      wallet: card1.wallet - card2.wallet,
      correction_point: card1.correction_point - card2.correction_point,
      pool_year: (card1.pool_year?.getTime() || 0) - (card2.pool_year?.getTime() || 0),
      pool_month: (card1.pool_month?.getTime() || 0) - (card2.pool_month?.getTime() || 0)
    };

    return values[comparisonField];
  }

  playRound(gameId, comparisonField = 'correction_point') {
    console.log('playRound called, known gameIds:', Object.keys(this.games));
    console.log('looking for:', gameId);
    console.log('found:', !!this.games[gameId]);
      const game = this.games[gameId];

    if (!game || game.status !== 'playing') {
      throw new Error('Game not ready to play');
    }

    // Get the top card of each player
    const activePlayers = game.players.filter(p => p.hand.length > 0);

    if (activePlayers.length < 2) {
      //we have a winner !!!!
      throw new Error('Not enough players with cards');
    }
    // Step 1: check top cards 
    const topCards = activePlayers.map(p => ({
      player: p,
      card: p.hand[0],
      value: p.hand[0][comparisonField] ?? 0
    }));
     console.log('--- Round', game.currentRound + 1, '---');
      topCards.forEach(({ player, value }) => {
        console.log(`  ${player.id} plays: ${value} (${comparisonField})`);
      });
       // step 2: Find winner(s) — handle ties
      const highestValue = Math.max(...topCards.map(t => t.value));

      const winners = topCards.filter(t => t.value === highestValue); //this will be updated to also check lower pool_date 
      const losers  = topCards.filter(t => t.value !== highestValue);

      activePlayers.forEach(p => p.hand.shift());
      if (!game.pile) game.pile = [];

      game.pile.push(...topCards.map(t => t.card));
      game.currentRound += 1;

      let roundResult;

      if (winners.length > 1) {
        // Draw — pile carries over, no hand changes beyond the shift
        console.log(`  DRAW between: ${winners.map(w => w.player.id).join(', ')} — pile is now ${game.pile.length} cards`);

        roundResult = {
          round: game.currentRound,
          type: 'draw',
          drawBetween: winners.map(w => w.player.id),
          pileSize: game.pile.length,
          comparisonField,
          winningValue: highestValue
        };

    } else {
      // Single winner collects the whole pile
      const winner = winners[0].player;
      winner.hand.push(...game.pile);
      winner.roundWins += 1;

      console.log(`  WINNER: ${winner.id} collects ${game.pile.length} cards — hand now ${winner.hand.length}`);
      losers.forEach(({ player }) => {
        console.log(`  ${player.id} lost — hand now ${player.hand.length}`);
      });

      game.pile = [];

      roundResult = {
        round: game.currentRound,
        type: 'winner',
        winnerId: winner.id,
        losers: losers.map(l => l.player.id),
        comparisonField,
        winningValue: highestValue
      };
    }

    game.roundWinners.push(roundResult);
    game.lastRoundResult = roundResult;
    console.log('About to return game:', game ? 'exists' : 'undefined');
    console.log('Game keys:', Object.keys(game));
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

  getGame(gameId) {
    return this.games[gameId] || null;
  }

  removeGame(gameId) {
    delete this.games[gameId];
  }
}
module.exports = new GameService();