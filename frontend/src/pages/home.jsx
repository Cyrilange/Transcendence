import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/style.css';
import GameConfig from '../assets/components/popups/GameConfig';
import Register from '../assets/components/popups/Register';
import ProfileCard from '../assets/components/cards/ProfileCard';
import { PhantomCard, FilledSlot } from '../assets/components/cards/PlayerSlot';

import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';

const MAX_OPPONENTS = 4;

function Home() {
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showRegister, setRegister] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [joinError, setJoinError] = useState(null);
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios.get('/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLoginSuccess = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setSlots([]); };

  const handleAddSlot = () => {
    if (slots.length >= MAX_OPPONENTS) return;
    setSlots(prev => [...prev, { type: 'bot', difficulty: 2 }]);
  };

  const handleRemoveSlot = (index) => setSlots(prev => prev.filter((_, i) => i !== index));

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

  const handleJoinGame = async () => {
    setJoinError(null);
    if (!joinId.trim()) return setJoinError('Enter a game ID');
    try {
      const res = await axios.get(`/api/games/${joinId.trim()}`, { withCredentials: true });
      if (res.data.success) {
        navigate(`/game/${joinId.trim()}`);
      }
    } catch (err) {
      setJoinError('Game not found');
    }
  };

  const hasOpponents = slots.length > 0;
  const showPhantom = slots.length < MAX_OPPONENTS;

  return (
    <div style={{ height: '100vh' }}>
      {user ? (
        <Stack direction="column" alignItems="center" spacing={3}>
          <div
            className="player-row"
            style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start', justifyContent: 'center', transition: 'all 0.3s ease' }}
          >
            <ProfileCard user={user}  onLogout={handleLogout}  onUpdate={(updatedUser) => setUser(updatedUser)}/>

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
            <Button variant="outlined" size="lg" onClick={() => setShowJoin(true)}>
              Join Game
            </Button>
          )}

          {/* Join Game Modal */}
          <Modal open={showJoin} onClose={() => setShowJoin(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ModalDialog variant="soft" sx={{ minWidth: 300 }}>
              <ModalClose />
              <Typography level="h4">Join a Game</Typography>
              <Stack spacing={1.5}>
                <Input
                  placeholder="Enter Game ID"
                  value={joinId}
                  onChange={e => setJoinId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoinGame()}
                />
                {joinError && <Typography color="danger" level="body-sm">{joinError}</Typography>}
                <Button variant="solid" onClick={handleJoinGame}>Join</Button>
              </Stack>
            </ModalDialog>
          </Modal>

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
  );
}

export default Home;