
import Stack from '@mui/joy/Stack'
import Button from '@mui/joy/Button'

//function to display the result. Should handle both win and loose state

export default function Result(gameWinner, rounds, roundsWon){
	const handlePlayAgain = () => {
        // Navigate back to lobby — adjust path to match your router setup
        window.location.href = '/';
 	 };
	return(
		<Stack>
			<h2>🏆 {gameWinner} Wins!</h2>
			<h2>Player has won/lost</h2> 
			<p>they won {roundsWon} / {rounds}</p> 
			<Button onClick={handlePlayAgain}> play again</Button>
			<Button variant="outlined" color="neutral" onClick={() => 	window.location.href = '/'}>
              Quit
            </Button>
		</Stack>
	);

}