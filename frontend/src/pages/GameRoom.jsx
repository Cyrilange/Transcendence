import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../assets/components/cards/Cards';
import Deck from '../user.json';
import io from 'socket.io-client';
import Stack from '@mui/joy/Stack'
const socket = io('http://localhost:3001');




const GameRoom = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  //const [socketConnected, setSocketConnected] = useState(false);
  const [status, setStatus] = useState('Connecting...');
  const [cards, setCards] = useState([]);

  //console.log("Current Game ID:", gameId); // Add this to check if it's undefined

  useEffect(() => {
    // Join the room
    //console.log("Raw Data Loaded:", Deck); // <-
    setCards(Deck);
    socket.emit('join_game', gameId);
    // Listen for state updates
    socket.on('game_state', (state) => {
      setGameState(state);
      setStatus('Connected');
	
    });

    socket.on('error', (err) => {
      setStatus(`Error: ${err.message}`);
    }); 

    return () => {
      socket.off('game_state');
      socket.off('error');
    };
  }, [gameId]);

  if (status.includes('Error')) return <div>{status}</div>;
  if (!gameState) return <div>Loading Game State...</div>;

  return (
    <div className="game-room">
      <h2>Game ID: {gameId}</h2>
      <p>Status: {gameState.status}</p>
      <p>Players: {gameState.players.length} / {gameState.config.playerCount}</p>
      <p>Round: {gameState.currentRound} / {gameState.config.rounds}</p>
     
      <p>Game is live! Waiting for actions...</p>
      <Stack direction="row" spacing={2} justifyContent="center">
      
        {cards.slice(0, gameState.config.playerCount).map((player, id) => (
			//<div className='CardSlot'>
        <Card 
            key={player.id}
            id={player.id}
            login={player.login}
            points={player.points} 
            wallet={player.wallet} 
            correction_point={player.correction_point}
            pool_month={player.pool_month}
            pool_year={player.pool_year}
            url={player.image.versions.small} 
          />

          // </div>
        ))}
        </Stack>
	
    
    </div>
  );
};

export default GameRoom;