const fs = require('fs');
const path = require('path');
const apiService = require('../callApi.js');


class GameService {
  constructor() {
    this.games = {};
    this.userJsonPath = path.join(__dirname, '../data/user.json');
  }

  getBotChoice(card, difficulty) {
    const stats = {
      wallet: card.wallet ?? 0,
      correction_point: card.correction_point ?? 0,
      startDate: card.startDate ? (999999 - card.startDate) : 0
    };

    const statNames = Object.keys(stats);

    if (difficulty === 'easy') {
      return statNames[Math.floor(Math.random() * statNames.length)];
    }

    if (difficulty === 'medium') {
      if (Math.random() < 0.6) {
        return statNames.reduce((a, b) => (stats[a] >= stats[b] ? a : b));
      }
      return statNames[Math.floor(Math.random() * statNames.length)];
    }

    return statNames.reduce((a, b) => (stats[a] >= stats[b] ? a : b));
  }

  parseStartDate(month, year) {
    if (!year) return null;

    const monthMap = {
      january: 1, february: 2, march: 3, april: 4,
      may: 5, june: 6, july: 7, august: 8,
      september: 9, october: 10, november: 11, december: 12
    };

    const m = monthMap[month?.toLowerCase()] || 1;
    const y = parseInt(year, 10);
    if (isNaN(y)) return null;

    return y * 100 + m;
  }

  async loadUserDeck() {
    try {
      const users = await apiService.fetchUsers();
    

      console.log("API RESPONSE LENGTH =", users?.length);
      return users.map(user => ({
        ...user,
        wallet: parseInt(user.wallet, 10) || 0,
        correction_point: parseInt(user.correction_point, 10) || 0,
        pool_month: user.pool_month || null,
        pool_year: user.pool_year || null,
        startDate: this.parseStartDate(user.pool_month, user.pool_year)
      }));
    } catch {
      return this.loadLocalDeck();
    }
  }

  loadLocalDeck() {
    try {
      const raw = fs.readFileSync(this.userJsonPath, 'utf8');
      const users = JSON.parse(raw);

      return users.map(user => ({
        ...user,
        wallet: parseInt(user.wallet, 10) || 0,
        correction_point: parseInt(user.correction_point, 10) || 0,
        pool_month: user.pool_month || null,
        pool_year: user.pool_year || null,
        startDate: this.parseStartDate(user.pool_month, user.pool_year)
      }));
    } catch {
      return [];
    }
  }

  shuffleDeck(deck) {
    const arr = [...deck];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  dealHands(players, deck) {
    const perPlayer = Math.floor(deck.length / players.length);

    players.forEach((p, i) => {
      const start = i * perPlayer;
      const end = start + perPlayer;

      p.hand = deck.slice(start, end).map(card => ({
        ...card,
        wallet: parseInt(card.wallet, 10) || 0,
        correction_point: parseInt(card.correction_point, 10) || 0,
        startDate: card.startDate ?? null
      }));
    });

    return players;
  }

  async createGame(gameId, playerCount, vsComputer, rounds, gameType = 'endless', difficulty = 'medium') {
    const deck = await this.loadUserDeck();

    const shuffled = this.shuffleDeck(deck);

    const needed = playerCount * 10;
    console.log("DECK LENGTH =", shuffled.length);
console.log("NEEDED =", needed);
    if (shuffled.length < needed) {
      throw new Error('Not enough cards in deck');
    }

    const players = Array.from({ length: playerCount }, (_, i) => ({
      id: `player_${i + 1}`,
      name: `Player ${i + 1}`,
      hand: [],
      roundWins: 0,
      socketId: null,
      isBot: vsComputer && i !== 0
    }));

    this.dealHands(players, shuffled);

    const gameState = {
      id: gameId,
      status: 'playing',
      config: { playerCount, vsComputer, rounds, gameType, difficulty },
      players,
      deck: shuffled,
      pile: [],
      activePlayerId: players[0].id,
      currentRound: 0,
      roundWinners: [],
      winner: null,
      winners: null,
      createdAt: new Date().toISOString()
    };

    this.games[gameId] = gameState;
    return gameState;
  }

  getGame(gameId) {
    return this.games[gameId] || null;
  }

  removeGame(gameId) {
    delete this.games[gameId];
  }
}

module.exports = new GameService();