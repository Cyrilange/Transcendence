import React, { useState }from 'react';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import Stack from '@mui/joy/Stack'

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FormControl from '@mui/joy/FormControl';

import SliderSteps from '../sliders/SliderSteps';
//import SliderLabel from '../sliders/SliderLabel';
import Button from '@mui/joy/Button';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import { FormLabel } from '@mui/joy';
import Slider from '@mui/joy/Slider';

const API_URL = 'http://localhost:3001/api/games';
	const marks = [
  {
	value: 2,
	label: '2',
  },
  {
	value: 3,
	label: '3',
  },
  {
	value: 4,
	label: '4',
  },
  {
	value: 5,
	label: '5',
  },

];
function valueText(value) {
  return `${value}`;
}

const GameConfig = ({showPopUp, closePopUp, title}) => {
	const navigate = useNavigate();
  	const [loading, setLoading] = useState(false);
 	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const config = {
      playerCount: parseInt(formData.get('playerNbr')),
      vsComputer: formData.get('vsComputer') === 'true',
      rounds: parseInt(formData.get('roundsNbr'))
    };
	for (var pair of formData.entries()) {
  	 	 console.log(pair[0]+ ', ' + pair[1]); 
}
	
    try {
      // Axios automatically handles JSON stringification and parsing
      const response = await axios.post(API_URL, config);
      
      // Access data directly from response.data
      const { gameId } = response.data;
      navigate(`/game/${gameId}`);
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle HTTP errors (400, 500, etc.)
        setError(err.response?.data?.error || 'Failed to create game');
      } else {
        setError('Network error. Please check your connection.');
      }
      console.error("Game creation failed:", err);
    } finally {
      setLoading(false);
    }
  }

	const [showDifficulty, setDifficulty] = useState(false)
	const [showRounds, setShowRounds] = useState(false)
	const [value, setValue] = React.useState('player');
	const [rounds, setRounds] = React.useState('standard'); 
	const [number, setNumber] = React.useState('playerNbr'); 
	const [roundsNbr, setRoundsNbr] = React.useState('coundsNbr'); 
	if (!showPopUp) {return null}

	/* const formData = new FormData(form, submitter);

		const output = document.getElementById("output");

		for (const [key, value] of formData) {
		output.textContent += `${key}: ${value}\n`;
		} */

	return (
		<Modal
		aria-labelledby="Game setup"
        aria-describedby="A form to configure a game"
        open={showPopUp}
        onClose={closePopUp}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >	 
	  <ModalDialog>
			<ModalClose />
			<form onSubmit={handleSubmit} >
			<Stack direction="column" spacing={1.5}>
				<Typography color='primary' level='h3'> {title}</Typography>
				<Typography color="neutral" level='h4'>Opponent</Typography>
					<Stack direction="row">
						<ToggleButtonGroup variant='outlined' color="primary" 
							value={value}
							onChange={(event, newValue) => {
								setValue(newValue);
							}}
							>
							<Button onClick={()=>setDifficulty(false)} name="player" value="player">Player</Button>
							<Button onClick={()=>setDifficulty(true)} name="computer" value="computer">Computer</Button>
							
						</ToggleButtonGroup>
					</Stack>
					<Typography color="neutral" level='h4'>Number of players</Typography>
					<Slider 
						id="playerNbr"
						name="playerNbr"
						aria-label="Number of players"
						defaultValue={2}
						min={2}
						max={5}
						step={1}
						//	getAriaValueText={valueText}
						valueLabelDisplay="off"
						value={number}
						onChange={(event, newNumber) => {
							setNumber(newNumber);
						}}
						marks={marks}
					/>
					{/* //<SliderSteps  aria-label="Number of players" /> */}
					
					{showDifficulty &&(
					<FormControl>
						<Typography color="neutral" level='h4'>Computer Difficulty</Typography>
						{error && <p style={{color: 'red'}}>{error}</p>}
						<SliderSteps name="difficulty" aria-label="Computer difficulty" />
					</FormControl>
					)}
					<Typography color="neutral" level='h4'>Game type</Typography>
					<Stack direction="row">
						<ToggleButtonGroup variant='outlined' color="primary" 
						value={rounds}
						onChange={(event) => {
							setRounds(event.target.value);
						}}
						>
						<Button onClick={()=>setShowRounds(false)} name="standard" value="standard" >Standard</Button>
						<Button onClick={()=>setShowRounds(true)} name="rounds" value="rounds" >Rounds</Button>
						
						</ToggleButtonGroup>
						</Stack>
					{showRounds &&(
					<div>
					{/* 	<Typography color="neutral" level='h4'>Number of rounds</Typography> */}
						<FormLabel>Number of rounds</FormLabel>
						    <Slider
								id="roundsNbr"
								name="roundsNbr" 
								value={roundsNbr}
								aria-label="Custom marks"
								defaultValue={20}
								min={10}
								max={30}
								step={1}
								getAriaValueText={valueText}
								valueLabelDisplay="true"
								onChange={(event, newRoundsNbr) => {
									setRoundsNbr(newRoundsNbr);
							}}
						/>
					</div>
					)}
					<Button sx={{marginTop: '15px'}} type="submit" variant="solid" disabled={loading}>  {loading ? 'Creating...' : 'Start Game'}</Button>				
				</Stack>
				</form>
			</ModalDialog>
		</Modal>
		)
};

export default GameConfig;