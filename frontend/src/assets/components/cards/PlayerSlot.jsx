//import { useState } from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';

const difficultyMarks = [
  { value: 1, label: 'Easy' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hard' },
];

const difficultyMap = { 1: 'easy', 2: 'medium', 3: 'hard' };

//Phantom card shown on row hover
const PhantomCard = ({ onClick }) => (
  <Card
    variant="outlined"
    onClick={onClick}
    sx={{
      width: 220,
      height: 320,
      bgcolor: 'transparent',
      border: '2px dashed',
      borderColor: 'neutral.400',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      // Takes up space but invisible — no display:none so layout is preserved
      opacity: 0,
      transform: 'translateX(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      '.player-row:hover &': {
        opacity: 1,
        
        transform: 'translateX(0px)',
      },
      '&:hover': {
        borderColor: 'primary.400',
        bgcolor: 'primary.softBg',
      }
    }}
  >
    <Stack alignItems="center" spacing={1}>
      <Typography level="h2" sx={{ opacity: 0.4 }}>+</Typography>
      <Typography level="body-sm" color="neutral">Add opponent</Typography>
    </Stack>
  </Card>
);

// A filled slot — either bot or player placeholder
const FilledSlot = ({ slot, onRemove, onToggleType, onDifficultyChange }) => {
  const isBot = slot.type === 'bot';

  return (
    <Card
      variant="outlined"
      color={isBot ? 'warning' : 'primary'}
      sx={{
        width: 220,
        height: 350,
        bgcolor: 'transparent',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 'md' }
      }}
    >
      <CardContent orientation="horizontal" sx={{ placeContent: 'space-between', alignItems: 'center' }}>
        <Typography color='primary' level="title-md">
          {isBot ? '🤖 Bot' : '👤 Player'}
        </Typography>
        <IconButton
          size="sm"
          variant="plain"
          color="danger"
          onClick={onRemove}
          sx={{ minWidth: 'unset' }}
        >
          ✕
        </IconButton>
      </CardContent>

      <CardContent>
        {/* Placeholder avatar area */}
        <div style={{
          width: '100%',
          height: '175px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed',
          borderColor: isBot ? 'var(--joy-palette-warning-300)' : 'var(--joy-palette-primary-300)',
          borderRadius: '4px',
          fontSize: '3rem'
        }}> 
        <h3 style={{ margin: ' 0px'  }}> {isBot ? '🤖' : '⏳'}</h3>
        </div>

        {/* Difficulty slider — only for bots */}
        {isBot && (
          <Stack spacing={1} >
           <Typography color="primary">Computer Difficulty</Typography>
            <Slider
              sx={{marginTop: '0px'}}
              value={slot.difficulty}
              onChange={(_, val) => onDifficultyChange(val)}
              min={1}
              max={3}
              step={1}
              marks={difficultyMarks}
              valueLabelDisplay="off"
              size="sm"
            />
          </Stack>
        )}

        {/* Player waiting message */}
        {!isBot && (
          <Typography level="body-xs" color="neutral" sx={{ mt: 1, textAlign: 'center' }}>
            Waiting for player to join...
          </Typography>
        )}
      </CardContent>

      <CardActions orientation="vertical">
        <Button
          variant="outlined"
          size="sm"
          fullWidth
          onClick={onToggleType}
          color={isBot ? 'primary' : 'warning'}
        >
          {isBot ? 'Switch to Player' : 'Switch to Bot'}
        </Button>
      </CardActions>
    </Card>
  );
};

// The full PlayerSlot — manages phantom vs filled state
const PlayerSlot = ({ slot, onRemove, onToggleType, onDifficultyChange, showPhantom }) => {
  if (!slot) {
    // No slot yet — show phantom card (visibility controlled by CSS on parent)
    return showPhantom ? <PhantomCard onClick={() => onToggleType()} /> : null;
  }

  return (
    <FilledSlot
      slot={slot}
      onRemove={onRemove}
      onToggleType={onToggleType}
      onDifficultyChange={onDifficultyChange}
    />
  );
};

export { PhantomCard, FilledSlot, difficultyMap };
export default PlayerSlot;