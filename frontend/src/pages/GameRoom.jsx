import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../assets/components/cards/Cards';
import io from 'socket.io-client';
import Stack from '@mui/joy/Stack';
import Badge from '@mui/joy/Badge';
import Button from '@mui/joy/Button';
import GameAlert from '../assets/components/popups/GameAlert';
import axios from 'axios';

const BlankCard = ({ playerId, handSize }) => (
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
    <p style={{ margin: 0, fontWeight: 'bold' }}>{playerId}</p>
    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
      {handSize > 0 ? `${handSize} cards remaining` : 'No cards left'}
    </p>
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

  const handlePlayAgain = () => {
    window.location.href = '/';
  };

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

    // Server tells us which player slot we were assigned
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
        const who = Array.isArray(result.drawBetween)
          ? result.drawBetween.join(' and ')
          : 'unknown players';
        setRoundMessage({
          type: 'warning',
          text: `Round ${result.round}: DRAW between ${who}! Pile grows to ${result.pileSize ?? 0} cards.`
        });
      } else if (result.type === 'winner') {
        setRoundMessage({
          type: 'success',
          text: `Round ${result.round}: ${result.winnerId} wins with ${result.winningCard} in ${result.comparisonField}!`
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

  const isMyTurn = gameState.activePlayerId === localPlayerId;
  const isBotThinking = !isMyTurn && gameState.players.find(
    p => p.id === gameState.activePlayerId
  )?.isBot;

  return (
    <div>
      <Stack direction="row" justifyContent="space-around">
        <p>Status: {gameState.status}</p>
        <p>Players: {gameState.players.length} / {gameState.config.playerCount}</p>
        <p>You are: <strong>{localPlayerId}</strong></p>
      </Stack>

      <p>Round: {gameState.currentRound} {gameState.config.gameType === 'rounds' ? `/ ${gameState.config.rounds}` : ''}</p>
      <p>Pile: {gameState.pile?.length ?? 0} cards</p>

      {/* Share link for human players */}
      {gameState.config.playerCount > 1 && !gameState.config.vsComputer && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
          Share this link: <strong>{window.location.href}</strong>
        </p>
      )}

      {roundMessage && (
        <GameAlert
          roundMessage={roundMessage}
          color={roundMessage.type === 'draw' ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          {roundMessage.text}
        </GameAlert>
      )}

      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {isBotThinking
          ? `🤖 ${gameState.activePlayerId} is thinking...`
          : isMyTurn
          ? '🟢 Your turn — pick a stat!'
          : `⏳ Waiting for ${gameState.activePlayerId}...`}
      </p>

      <Stack direction="row" spacing={2} justifyContent="center">
        {gameState.players
          .filter(player => player && player.hand && player.hand.length > 0)
          .map((player) => {
            const isLocal = player.id === localPlayerId;
            const topCard = player.hand[0];
            if (!topCard) return null;

            return (
              <div key={player.id} style={{ opacity: isMyTurn ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                {isLocal ? (
                  <Badge badgeContent={player.hand.length} color="neutral" variant="plain">
                    <Card
                      id={topCard.id}
                      login={topCard.login}
                      wallet={topCard.wallet}
                      correction_point={topCard.correction_point}
                      pool_month={topCard.pool_month}
                      pool_year={topCard.pool_year}
                      url={topCard.image?.versions?.small}
                      onPlayStat={isMyTurn ? handlePlayRound : null}
                    />
                  </Badge>
                ) : (
                  <BlankCard playerId={player.id} handSize={player.hand?.length ?? 0} />
                )}
                <h4 style={{ textAlign: 'center' }}>{player.id}</h4>
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
          <Stack sx={{ minWidth: 300, textAlign: 'center', backgroundColor: 'grey', padding: '8px', borderRadius: '5px' }}>
            {gameOver.isDraw ? (
              <>
                <h2>🤝 It's a Draw!</h2>
                <p>Drawn between: {gameOver.winners.map(w => w.id).join(', ')}</p>
                <p>Rounds played: {gameState.currentRound}</p>
              </>
            ) : (
              <>
                <h2>{gameOver.winner?.id === localPlayerId ? '🏆 You Win!' : '💀 You Lose!'}</h2>
                <h3>Winner: {gameOver.winner?.id}</h3>
                {gameState.players.map(p => (
                  <p key={p.id} style={{ margin: '2px 0' }}>
                    {p.id}: {p.hand.length} cards — {p.roundWins} round wins
                    {p.id === gameOver.winner?.id ? ' 🏆' : ''}
                  </p>
                ))}
              </>
            )}
            <Button variant="solid" color="primary" onClick={handlePlayAgain}>Play Again</Button>
            <Button variant="outlined" color="neutral" onClick={() => window.location.href = '/'}>Quit</Button>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default GameRoom;