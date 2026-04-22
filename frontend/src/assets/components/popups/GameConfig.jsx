import React, { useState, useEffect } from 'react';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import { FormLabel } from '@mui/joy';
import Slider from '@mui/joy/Slider';
import Chip from '@mui/joy/Chip';

const API_URL = 'http://localhost:3001/api/games';

const difficultyMap = { 1: 'easy', 2: 'medium', 3: 'hard' };

function valueText(value) { return `${value}`; }

// GameConfig now receives slots from Home and derives config from them
const GameConfig = ({ showPopUp, closePopUp, title, slots = [] }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRounds, setShowRounds] = useState(false);
  const [roundsNbr, setRoundsNbr] = useState(20);

  // Derived from slots — no manual input needed
  const playerCount = slots.length + 1; // +1 for the human player
  const bots = slots.filter(s => s.type === 'bot');
  const humanPlayers = slots.filter(s => s.type === 'player');
  const vsComputer = bots.length > 0;

  // For multi-bot games use the highest difficulty among all bots
  // Individual bot difficulties are already set per-slot in Home
  const highestDifficulty = bots.length > 0
    ? Math.max(...bots.map(b => b.difficulty))
    : 2;

  // Reset state when modal opens
  useEffect(() => {
    if (showPopUp) {
      setShowRounds(false);
      setRoundsNbr(20);
      setError(null);
    }
  }, [showPopUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const config = {
      playerCount,
      vsComputer,
      rounds: showRounds ? roundsNbr : null,
      gameType: showRounds ? 'rounds' : 'endless',
      difficulty: difficultyMap[highestDifficulty],
      // Pass full bot config for future per-bot difficulty support
      bots: bots.map(b => ({ difficulty: difficultyMap[b.difficulty] })),
      humanSlots: humanPlayers.length
    };

    console.log('Game config being sent:', config);

    try {
      const response = await axios.post(API_URL, config);
      const { gameId } = response.data;
      navigate(`/game/${gameId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to create game');
      } else {
        setError('Network error. Please check your connection.');
      }
      console.error('Game creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!showPopUp) return null;

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
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={1.5}>
            <Typography color="primary" level="h3">{title}</Typography>

            {/* Summary of what was configured in Home */}
            <Typography color="neutral" level="h4">Game Summary</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="sm" variant="soft" color="primary">
                👥 {playerCount} players
              </Chip>
              {bots.map((b, i) => (
                <Chip key={i} size="sm" variant="soft" color="warning">
                  🤖 Bot {i + 1} — {difficultyMap[b.difficulty]}
                </Chip>
              ))}
              {humanPlayers.map((_, i) => (
                <Chip key={i} size="sm" variant="soft" color="success">
                  👤 Player {i + 2}
                </Chip>
              ))}
            </Stack>

            {/* Only thing left to configure is game type */}
            <Typography color="neutral" level="h4">Game Type</Typography>
            <Stack direction="row">
              <ToggleButtonGroup
                variant="outlined"
                color="primary"
                value={showRounds ? 'rounds' : 'standard'}
                onChange={(e, val) => {
                  if (val !== null) setShowRounds(val === 'rounds');
                }}
              >
                <Button value="standard">Standard</Button>
                <Button value="rounds">Rounds</Button>
              </ToggleButtonGroup>
            </Stack>

            {showRounds && (
              <div>
                <FormLabel>Number of rounds</FormLabel>
                <Slider
                  value={roundsNbr}
                  aria-label="Number of rounds"
                  defaultValue={20}
                  min={10}
                  max={30}
                  step={1}
                  getAriaValueText={valueText}
                  valueLabelDisplay="on"
                  onChange={(e, val) => setRoundsNbr(val)}
                />
              </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button
              sx={{ marginTop: '15px' }}
              type="submit"
              variant="solid"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Start Game'}
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default GameConfig;