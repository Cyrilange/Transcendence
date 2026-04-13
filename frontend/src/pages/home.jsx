import React, { useState }from 'react';
import '../assets/styles/style.css';
import GameConfig from  '../assets/components/popups/GameConfig';
import Register from  '../assets/components/popups/Register';

import Button from '@mui/joy/Button';

function Home() {
	const [showPopUp, setShowPopUp] = useState(false)
	const [showRegister, setRegister] = useState(false)


  return (
	<div  className="grid">
			<div className="grid-center">
				<h1>Ready to discover the Top Trum of 42 Malaga?</h1>
				<Button variant="outlined" size="lg" onClick={()=>setRegister(true)}> Login </Button>
				<Register showPopUp={showRegister} closePopUp={()=>setRegister(false)} title="Sign up" />
		
				<Button variant="outlined" size="lg" onClick={()=>setShowPopUp(true)}> Start a game</Button>
				<GameConfig showPopUp={showPopUp} closePopUp={()=>setShowPopUp(false)} title="New game" />

			</div>
	</div>
  );
}

export default Home;