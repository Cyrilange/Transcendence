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

    if (difficulty === 'easy')
      return statNames[Math.floor(Math.random() * statNames.length)];

    if (difficulty === 'medium') {
      if (Math.random() < 0.6)
        return statNames.reduce((a, b) => (stats[a] >= stats[b] ? a : b));
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
    //const perPlayer = Math.floor(deck.length / players.length);
    const perPlayer = 30;
    players.forEach((p, i) => {
      p.hand = deck.slice(i * perPlayer, (i + 1) * perPlayer).map(card => ({
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

    const needed = playerCount * 30;
    console.log("DECK LENGTH =", shuffled.length, "NEEDED =", needed);
    if (shuffled.length < needed)
      throw new Error('Not enough cards in deck');

    const players = Array.from({ length: playerCount }, (_, i) => ({
      id: i === 0 ? 'player_1' : `bot_${i}`,
      name: i === 0 ? 'Player 1' : `Bot ${i}`,
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
      activePlayerId: 'player_1',
      currentRound: 0,
      roundWinners: [],
      winner: null,
      winners: null,
      createdAt: new Date().toISOString()
    };

    this.games[gameId] = gameState;
    return gameState;
  }

  playRound(gameId, comparisonField, requestingPlayerId) {
    const game = this.games[gameId];

    if (!game || game.status !== 'playing')
      throw new Error('Game not ready to play');

    if (requestingPlayerId && game.activePlayerId !== requestingPlayerId)
      throw new Error('It is not your turn to pick');

    const activePlayers = game.players.filter(p => p.hand.length > 0);
    if (activePlayers.length < 2)
      throw new Error('Not enough players with cards');

    const activePlayer = game.players.find(p => p.id === game.activePlayerId);
    if (activePlayer?.isBot) {
      const difficulty = game.config.difficulty || 'medium';
      comparisonField = this.getBotChoice(activePlayer.hand[0], difficulty);
      console.log(`Bot (${activePlayer.id}) chose: ${comparisonField}`);
    }

    const topCards = activePlayers.map(p => ({
      player: p,
      card: p.hand[0],
      value: p.hand[0][comparisonField] ?? 0
    }));

    console.log('--- Round', game.currentRound + 1, '---');
    topCards.forEach(({ player, value }) =>
      console.log(`  ${player.id}: ${value} (${comparisonField})`)
    );

    const isLowerWins = comparisonField === 'startDate';
    const bestValue = isLowerWins
      ? Math.min(...topCards.map(t => t.value).filter(v => v))
      : Math.max(...topCards.map(t => t.value));

    const winners = topCards.filter(t => t.value === bestValue);
    const losers  = topCards.filter(t => t.value !== bestValue);

    activePlayers.forEach(p => p.hand.shift());
    if (!game.pile) game.pile = [];
    game.pile.push(...topCards.map(t => t.card));
    game.currentRound += 1;

    let roundResult;

    if (winners.length > 1) {
      console.log(`  DRAW — pile: ${game.pile.length} cards`);
      roundResult = {
        round: game.currentRound,
        type: 'draw',
        drawBetween: winners.map(w => w.player.id),
        pileSize: game.pile.length,
        comparisonField,
        winningValue: bestValue
      };
    } else {
      const winner = winners[0].player;
      const winningCard = winners[0].card.login;
      winner.hand.push(...game.pile);
      winner.roundWins += 1;
      game.pile = [];
      console.log(`  WINNER: ${winner.id} — hand: ${winner.hand.length}`);

      roundResult = {
        round: game.currentRound,
        type: 'winner',
        winnerId: winner.id,
        losers: losers.map(l => l.player.id),
        comparisonField,
        winningValue: bestValue,
        winningCard
      };
    }

    if (winners.length === 1)
      game.activePlayerId = winners[0].player.id;

    const activeAfter = game.players.filter(p => p.hand.length > 0);

    if (game.config.gameType === 'rounds' && game.currentRound >= game.config.rounds) {
      const maxCards = Math.max(...game.players.map(p => p.hand.length));
      const roundsWinners = game.players.filter(p => p.hand.length === maxCards);
      game.status = 'finished';
      if (roundsWinners.length > 1) { game.winner = null; game.winners = roundsWinners; }
      else { game.winner = roundsWinners[0]; game.winners = null; }
    } else if (game.config.gameType !== 'rounds' && activeAfter.length <= 1) {
      game.status = 'finished';
      if (activeAfter.length === 0) { game.winner = null; game.winners = game.players; }
      else { game.winner = activeAfter[0]; game.winners = null; }
    }

    game.roundWinners.push(roundResult);
    game.lastRoundResult = roundResult;
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