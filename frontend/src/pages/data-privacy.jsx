import React from 'react';
import {
  Sheet,
  Typography,
  Stack,
  Divider,
  Box,
  List,
  ListItem
} from '@mui/joy';

const DataPolicy = () => {
  return (
    <Sheet
      variant="outlined"
      sx={{ p: 4, borderRadius: 'md', maxWidth: 800, mx: 'auto', my: 4 }}
    >
      <Typography level="h2" component="h1" gutterBottom>
        Data Privacy Policy for 42SuperTrump
      </Typography>

      <Typography level="body-sm" sx={{ mb: 2, fontStyle: 'italic' }}>
        Last updated: May 2024
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={3}>
        <Box>
          <Typography level="h4">1. Information Collection</Typography>
          <Typography level="body-md">
            We collect account, profile, social, and OAuth data to operate the platform.
          </Typography>

          <List marker="disc" sx={{ pl: 2 }}>
            <ListItem>Account credentials (hashed & salted)</ListItem>
            <ListItem>Game statistics (wins/losses)</ListItem>
            <ListItem>Friends list and chat history</ListItem>
            <ListItem>42 OAuth public profile data</ListItem>
          </List>
        </Box>

        <Box>
          <Typography level="h4">2. Data Usage</Typography>
          <Typography level="body-md">
            Data is used for authentication, matchmaking, chat, and leaderboard features.
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">3. Data Security</Typography>
          <Typography level="body-md">
            Data is stored in SQLite and transmitted securely via HTTPS.
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">4. User Rights</Typography>
          <Typography level="body-md">
            Users may request access or deletion of their personal data.
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">5. Cookies</Typography>
          <Typography level="body-md">
            Session cookies are used to maintain login state.
          </Typography>
        </Box>
      </Stack>
    </Sheet>
  );
};

export default DataPolicy;