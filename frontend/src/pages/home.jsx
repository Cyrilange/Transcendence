import React, { useState } from 'react';
import '../assets/styles/style.css';
import GameConfig from '../assets/components/popups/GameConfig';
import Register from '../assets/components/popups/Register';
import ProfileCard from '../assets/components/cards/ProfileCard';
import { PhantomCard, FilledSlot } from '../assets/components/cards/PlayerSlot';

import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

const MAX_OPPONENTS = 3; // max 4 players total including the user

function Home() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showRegister, setRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Each slot: { type: 'bot' | 'player', difficulty: 1|2|3 }
  const [slots, setSlots] = useState([]);

  const handleAddSlot = () => {
    if (slots.length >= MAX_OPPONENTS) return;
    setSlots(prev => [...prev, { type: 'bot', difficulty: 2 }]);
  };

  const handleRemoveSlot = (index) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleType = (index) => {
    setSlots(prev => prev.map((slot, i) =>
      i === index
        ? { ...slot, type: slot.type === 'bot' ? 'player' : 'bot' }
        : slot
    ));
  };

  const handleDifficultyChange = (index, value) => {
    setSlots(prev => prev.map((slot, i) =>
      i === index ? { ...slot, difficulty: value } : slot
    ));
  };

  const hasOpponents = slots.length > 0;
  const showPhantom = slots.length < MAX_OPPONENTS;

  return (
    <div style={{height: '100vh'}}>
      <div>
        {isLoggedIn ? (
          <Stack direction="column" alignItems="center" spacing={3}>

            {/* Card row — profile + opponent slots + phantom */}
            <div
              className="player-row"
              style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start',  justifyContent: 'center', transition: 'all 0.3s ease' }}
            >
              {/* User's own profile card */}
              <ProfileCard onLogout={() => setIsLoggedIn(false)} />

              {/* Filled opponent slots */}
              {slots.map((slot, index) => (
                <FilledSlot
                  key={index}
                  slot={slot}
                  onRemove={() => handleRemoveSlot(index)}
                  onToggleType={() => handleToggleType(index)}
                  onDifficultyChange={(val) => handleDifficultyChange(index, val)}
                />
              ))}

              {/* Phantom card — visible on row hover if under max */}
              {showPhantom && <PhantomCard onClick={handleAddSlot} />}
            </div>

            {/* Create game button — only show when opponents added */}
            {hasOpponents && (
              <Stack direction="column" alignItems="center" spacing={2}>
                <Button
                  variant="solid"
                  size="lg"
                  color="primary"
                  onClick={() => setShowPopUp(true)}
                >
                  Create Game
                </Button>
                <GameConfig
                  showPopUp={showPopUp}
                  closePopUp={() => setShowPopUp(false)}
                  title="New game"
                  slots={slots}
                />
              </Stack>
            )}

            {/* Join game button — show when no opponents added yet */}
            {!hasOpponents && (
              <Button
                variant="outlined"
                size="lg"
                onClick={() => alert('Join game — coming soon')}
              >
                Join Game
              </Button>
            )}

          </Stack>
        ) : (
          <Stack direction="column" alignItems="center" spacing={2}>
            <Button variant="outlined" size="lg" onClick={() => setRegister(true)}>
              Login
            </Button>
            <Register
              showPopUp={showRegister}
              closePopUp={() => setRegister(false)}
              title="Sign up"
            />
          {/*   <Button variant="outlined" size="lg" onClick={() => setShowPopUp(true)}>
              Start a game
            </Button> */}
            <GameConfig
              showPopUp={showPopUp}
              closePopUp={() => setShowPopUp(false)}
              title="New game"
            />
          </Stack>
        )}
      </div>
    </div>
  );
}

export default Home;