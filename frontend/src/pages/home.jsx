import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/style.css';
import GameConfig from '../assets/components/popups/GameConfig';
import Register from '../assets/components/popups/Register';
import ProfileCard from '../assets/components/cards/ProfileCard';
import { PhantomCard, FilledSlot } from '../assets/components/cards/PlayerSlot';

import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

const MAX_OPPONENTS = 3;

function Home() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showRegister, setRegister] = useState(false);
  const [user, setUser] = useState(null); // null = not logged in
  const [slots, setSlots] = useState([]);

  // Check existing session on mount
  useEffect(() => {
    axios.get('/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSlots([]);
  };

  const handleAddSlot = () => {
    if (slots.length >= MAX_OPPONENTS) return;
    setSlots(prev => [...prev, { type: 'bot', difficulty: 2 }]);
  };

  const handleRemoveSlot = (index) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleType = (index) => {
    setSlots(prev => prev.map((slot, i) =>
      i === index ? { ...slot, type: slot.type === 'bot' ? 'player' : 'bot' } : slot
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
    <div style={{ height: '100vh' }}>
      <div>
        {user ? (
          <Stack direction="column" alignItems="center" spacing={3}>
            <div
              className="player-row"
              style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start', justifyContent: 'center', transition: 'all 0.3s ease' }}
            >
              <ProfileCard user={user} onLogout={handleLogout} />

              {slots.map((slot, index) => (
                <FilledSlot
                  key={index}
                  slot={slot}
                  onRemove={() => handleRemoveSlot(index)}
                  onToggleType={() => handleToggleType(index)}
                  onDifficultyChange={(val) => handleDifficultyChange(index, val)}
                />
              ))}

              {showPhantom && <PhantomCard onClick={handleAddSlot} />}
            </div>

            {hasOpponents && (
              <Stack direction="column" alignItems="center" spacing={2}>
                <Button variant="solid" size="lg" color="primary" onClick={() => setShowPopUp(true)}>
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

            {!hasOpponents && (
              <Button variant="outlined" size="lg" onClick={() => alert('Join game — coming soon')}>
                Join Game
              </Button>
            )}
          </Stack>
        ) : (
          <Stack direction="column" alignItems="center" spacing={2}>
            <Button variant="outlined" size="lg" onClick={() => setRegister(true)}>
              Login / Register
            </Button>
            <Register
              showPopUp={showRegister}
              closePopUp={() => setRegister(false)}
              title="Welcome"
              onLoginSuccess={handleLoginSuccess}
            />
          </Stack>
        )}
      </div>
    </div>
  );
}

export default Home;