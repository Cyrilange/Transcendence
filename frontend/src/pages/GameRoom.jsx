import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../assets/components/cards/Cards';
import io from 'socket.io-client';
import Stack from '@mui/joy/Stack';
import Badge from '@mui/joy/Badge';
import Button from '@mui/joy/Button';
import GameAlert from '../assets/components/popups/GameAlert';
import axios from 'axios';

// Shown for an opponent who has joined — hides their cards but shows name + count
const BlankCard = ({ playerName, handSize }) => (
  <div style={{
    width: 200,
    minHeight: 320,
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: '8px'
  }}>
    <p style={{ margin: 0, fontWeight: 'bold' }}>{playerName}</p>
    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
      {handSize > 0 ? `${handSize} cards remaining` : 'No cards left'}
    </p>
  </div>
);

// Shown for a human slot that nobody has connected to yet
const WaitingCard = ({ slotNumber }) => (
  <div style={{
    width: 200,
    minHeight: 320,
    border: '2px dashed #888',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: '8px',
    opacity: 0.6
  }}>
    <p style={{ margin: 0, fontSize: '1.5rem' }}>⏳</p>
    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>Waiting for player {slotNumber}…</p>
  </div>
);

const GameRoom = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [roundMessage, setRoundMessage] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [localPlayerId, setLocalPlayerId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('/', { path: '/socket.io', withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', async () => {
      try {
        const res = await axios.get('/auth/me', { withCredentials: true });
        socket.emit('join_game', { gameId, login: res.data.login });
      } catch {
        socket.emit('join_game', { gameId, login: null });
      }
    });

    socket.on('player_assigned', ({ playerId }) => {
      setLocalPlayerId(playerId);
    });

    socket.on('game_state', (state) => {
      setGameState(state);
      setStatus('Connected');

      if (state.status === 'finished') {
        if (state.winners && state.winners.length > 1) {
          setGameOver({ isDraw: true, winners: state.winners, winner: null });
        } else {
          setGameOver({ isDraw: false, winner: state.winner, winners: null });
        }
      }

      const result = state.lastRoundResult;
      if (!result) return;

      if (result.type === 'draw') {
        const drawNames = Array.isArray(result.drawBetween)
          ? result.drawBetween.map(id => {
              const p = state.players.find(pl => pl.id === id);
              return p?.name ?? id;
            }).join(' and ')
          : 'unknown players';
        setRoundMessage({
          type: 'warning',
          text: `Round ${result.round}: DRAW between ${drawNames}! Pile grows to ${result.pileSize ?? 0} cards.`
        });
      } else if (result.type === 'winner') {
        const winnerDisplay = result.winnerName
          ?? state.players.find(p => p.id === result.winnerId)?.name
          ?? result.winnerId;
        setRoundMessage({
          type: 'success',
          text: `Round ${result.round}: ${winnerDisplay} wins with ${result.winningCard} in ${result.comparisonField}!`
        });
      }
    });

    socket.on('error', (err) => {
      setStatus(`Error: ${err.message}`);
    });

    return () => {
      socket.off('game_state');
      socket.off('player_assigned');
      socket.off('error');
      socket.disconnect();
    };
  }, [gameId]);

  const handlePlayRound = (comparisonField) => {
    if (!localPlayerId) return;
    if (gameState.activePlayerId !== localPlayerId) return;
    if (socketRef.current?.connected) {
      socketRef.current.emit('play_action', {
        gameId,
        action: 'play_round',
        comparisonField,
        playerId: localPlayerId
      });
    }
  };

  if (status.includes('Error')) return <div>{status}</div>;
  if (!gameState) return <div>Loading Game State...</div>;
  if (!localPlayerId) return <div>Joining game...</div>;

  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const isMyTurn = gameState.activePlayerId === localPlayerId;
  const activePlayer = gameState.players.find(p => p.id === gameState.activePlayerId);
  const isBotThinking = !isMyTurn && activePlayer?.isBot;

  // Block play until every human slot has connected
  const waitingForPlayers = gameState.players.some(p => !p.isBot && !p.socketId);

  let humanSlotCounter = 0;

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', padding: '8px' }}>
      <Stack direction="row" justifyContent="space-around" flexWrap="wrap" useFlexGap sx={{ px: 1 }}>
        <p>Status: {gameState.status}</p>
        <p>Players: {gameState.players.length} / {gameState.config.playerCount}</p>
        <p>You are: <strong>{localPlayer?.name ?? localPlayerId}</strong></p>
      </Stack>

      <p>Round: {gameState.currentRound} {gameState.config.gameType === 'rounds' ? `/ ${gameState.config.rounds}` : ''}</p>
      <p>Pile: {gameState.pile?.length ?? 0} cards</p>

      {/* Share link shown while waiting for human opponents */}
      {waitingForPlayers && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
          Share this link to invite a player: <strong>{window.location.href}</strong>
        </p>
      )}

      {roundMessage && !waitingForPlayers && (
        <GameAlert
          roundMessage={roundMessage}
          color={roundMessage.type === 'draw' ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          {roundMessage.text}
        </GameAlert>
      )}

      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {waitingForPlayers
          ? '⏳ Waiting for all players to join...'
          : isBotThinking
          ? `🤖 ${activePlayer?.name ?? gameState.activePlayerId} is thinking...`
          : isMyTurn
          ? '🟢 Your turn — pick a stat!'
          : `⏳ Waiting for ${activePlayer?.name ?? gameState.activePlayerId}...`}
      </p>

      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
        {gameState.players.map((player) => {
          if (!player) return null;

          const isLocal = player.id === localPlayerId;
          const hasJoined = player.isBot || !!player.socketId;

          // Human slot not yet connected — waiting placeholder
          if (!hasJoined) {
            humanSlotCounter++;
            return (
              <div key={player.id}>
                <WaitingCard slotNumber={humanSlotCounter} />
                <h4 style={{ textAlign: 'center', margin: '6px 0 0', opacity: 0.5 }}>
                  Waiting...
                </h4>
              </div>
            );
          }

          // Opponent with no cards left
          if (!isLocal && (!player.hand || player.hand.length === 0)) {
            return (
              <div key={player.id}>
                <BlankCard playerName={player.name} handSize={0} />
                <h4 style={{ textAlign: 'center', margin: '6px 0 0' }}>{player.name}</h4>
              </div>
            );
          }

          // Local player's own card
          if (isLocal) {
            const topCard = player.hand[0];
            if (!topCard) return null;
            return (
              <div key={player.id} style={{ opacity: isMyTurn && !waitingForPlayers ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                <Badge badgeContent={player.hand.length} color="neutral" variant="plain">
                  <Card
                    id={topCard.id}
                    login={topCard.login}
                    wallet={topCard.wallet}
                    correction_point={topCard.correction_point}
                    pool_month={topCard.pool_month}
                    pool_year={topCard.pool_year}
                    url={topCard.image?.versions?.small}
                    onPlayStat={isMyTurn && !waitingForPlayers ? handlePlayRound : null}
                  />
                </Badge>
                <h4 style={{ textAlign: 'center', margin: '6px 0 0' }}>{player.name}</h4>
              </div>
            );
          }

          // Opponent's face-down card
          return (
            <div key={player.id} style={{ opacity: isMyTurn && !waitingForPlayers ? 1 : 0.5, transition: 'opacity 0.3s' }}>
              <BlankCard playerName={player.name} handSize={player.hand?.length ?? 0} />
              <h4 style={{ textAlign: 'center', margin: '6px 0 0' }}>{player.name}</h4>
            </div>
          );
        })}
      </Stack>

      {gameOver && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <Stack sx={{ minWidth: 300, textAlign: 'center', backgroundColor: 'grey', padding: '8px', borderRadius: '5px', gap: 1 }}>
            {gameOver.isDraw ? (
              <>
                <h2>🤝 It's a Draw!</h2>
                <p>Drawn between: {gameOver.winners.map(w => w.name ?? w.id).join(', ')}</p>
                <p>Rounds played: {gameState.currentRound}</p>
              </>
            ) : (
              <>
                <h2>{gameOver.winner?.id === localPlayerId ? '🏆 You Win!' : '💀 You Lose!'}</h2>
                <h3>Winner: {gameOver.winner?.name ?? gameOver.winner?.id}</h3>
                {gameState.players.map(p => (
                  <p key={p.id} style={{ margin: '2px 0' }}>
                    {p.name}: {p.hand.length} cards — {p.roundWins} round wins
                    {p.id === gameOver.winner?.id ? ' 🏆' : ''}
                  </p>
                ))}
              </>
            )}
            <Button variant="outlined" color="neutral" onClick={() => window.location.href = '/'}>Quit</Button>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
