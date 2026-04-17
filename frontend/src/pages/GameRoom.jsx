import { useEffect, useState, useRef  } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../assets/components/cards/Cards';
import io from 'socket.io-client';
import Stack from '@mui/joy/Stack'
import Badge from '@mui/joy/Badge';
import Button from '@mui/joy/Button';
import Alert from '@mui/joy/Alert';





const GameRoom = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [roundMessage, setRoundMessage] = useState(null); // null | { type, text }
  const socketRef = useRef(null); 

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;
    
   socket.on('connect', () => {
     socket.emit('join_game', gameId);
    });

   socket.on('game_state', (state) => {
      console.log('lastRoundResult received:', JSON.stringify(state.lastRoundResult, null, 2));

      setGameState(state);
      setStatus('Connected');

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
        const winner = result.winnerId ?? 'unknown';
        const losers = Array.isArray(result.losers) && result.losers.length 
          ? result.losers.join(', ') 
          : 'none';
        setRoundMessage({
          type: 'success',
          text: `Round ${result.round}: ${winner} wins with ${result.winningValue} ${result.comparisonField}! Losers: ${losers}.`
        });
      }
    });

   socket.on('error', (err) => {
      setStatus(`Error: ${err.message}`);
    }); 

    return () => {
     socket.off('game_state');
     socket.off('error');
     socket.disconnect();
    };
  }, [gameId]);

  const handlePlayRound = (e, comparisonField) => {
    
     e.preventDefault();
       console.log('Emitting play_action for gameId:', gameId);
    if (socketRef.current) {
      console.log('Socket connected:', socketRef.current.connected);
      socketRef.current.emit('play_action', {
        gameId,
        action: 'play_round',
        comparisonField
      });
    } else {
    console.log('No socket ref!');
  }
  };

  if (status.includes('Error')) return <div>{status}</div>;
  if (!gameState) return <div>Loading Game State...</div>;

  return (
    <div className="game-room">
      <h2>Game ID: {gameId}</h2>
      <p>Status: {gameState.status}</p>
      <p>Players: {gameState.players.length} / {gameState.config.playerCount}</p>
      <p>Round: {gameState.currentRound} / {gameState.config.rounds}</p>
      <p>Pile: {gameState.pile?.length ?? 0} cards</p>
      <p>Game is live! Waiting for actions...</p>
      {/* Round result message */}
      {roundMessage && (
        <Alert
          color={roundMessage.type === 'draw' ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          {roundMessage.text}
        </Alert>
      )}
   
      <Stack direction="row" spacing={2} justifyContent="center">
      {gameState.players
        .filter(player => player && player.hand && player.hand.length > 0)
        .map((player) => {
          const topCard = player.hand[0];
          if (!topCard) return null;

          return (
            <div key={player.id}>
              <Badge
                  badgeContent={player.hand.length}
                  color="neutral"
                  variant="plain"
                >
              <Card
                id={topCard.id}
                login={topCard.login}
                wallet={topCard.wallet}
                correction_point={topCard.correction_point}
                pool_month={topCard.pool_month}
                pool_year={topCard.pool_year}
                url={topCard.image?.versions?.small}
               // onPlayStat={handlePlayStat} 
              />
            </Badge>
              <h4 style={{ textAlign: 'center' }}>{player.id}</h4>
            </div>
          );
        })}
      </Stack>
       <Button onClick={(e) => handlePlayRound(e, 'correction_point')}>
          Play Round (correction_point)
        </Button>
    </div>
  );
};

export default GameRoom;