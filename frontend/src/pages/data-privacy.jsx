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


export const DataPolicy = () => {
  return (
    <Sheet 
      variant="outlined" 
      sx={{ p: 4, borderRadius: 'md', maxWidth: 800, mx: 'auto', my: 4 }}
    >
      <Typography level="h2" component="h1" gutterBottom>
        Terms of Service for 42SuperTrump
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2, fontStyle: 'italic' }}>
        Last updated: May 2024
      </Typography>
      
      <Divider sx={{ my: 2 }} />

      <Stack spacing={3}>
        <Box>
          <Typography level="h4">1. Acceptance of Terms</Typography>
          <Typography level="body-md">
            By accessing or using <strong>42SuperTrump</strong>, a web application created as part of the <strong>42 curriculum</strong>, you agree to be bound by these Terms of Service. This project is a collaborative effort involving roles like Product Owner, Project Manager, and Technical Lead to ensure a secure user experience [3].
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">2. Description of Service</Typography>
          <Typography level="body-md">
            42SuperTrump is a real-time web platform where users can:
          </Typography>
          <List marker="disc" sx={{ pl: 2 }}>
            <ListItem>Participate in real-time card matches [4].</ListItem>
            <ListItem>Manage profiles and social interaction (chat and friends) [5].</ListItem>
            <ListItem>Track game statistics and leaderboards [6].</ListItem>
          </List>
        </Box>

        <Box>
          <Typography level="h4">3. User Accounts and Security</Typography>
          <Typography level="body-md">
            Users register via <strong>Standard User Management</strong> or <strong>OAuth 2.0 (42 API)</strong> [7, 8].
            All credentials are stored using secure hashing and salting techniques. All external connections are encrypted via <strong>HTTPS</strong> [7].
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">4. Multi-user Interaction</Typography>
          <Typography level="body-md">
            The platform supports simultaneous multi-user interaction [2]. Users agree not to engage in actions that cause data corruption or race conditions. Users may <strong>block others</strong> from messaging them in the advanced chat module [9].
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">5. Limitation of Liability</Typography>
          <Typography level="body-md">
            As a student project, this application is provided "as is". Developers are not liable for technical issues, data loss, or service interruptions during the evaluation period.
          </Typography>
        </Box>
      </Stack>
    </Sheet>
  );
};


export const PrivacyPolicy = () => {
  return (
    <Sheet 
      variant="outlined" 
      sx={{ p: 4, borderRadius: 'md', maxWidth: 800, mx: 'auto', my: 4 }}
    >
      <Typography level="h2" component="h1" gutterBottom>
        Privacy Policy for 42SuperTrump
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2, fontStyle: 'italic' }}>
        Last updated: May 2024
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={3}>
        <Box>
          <Typography level="h4">1. Information Collection</Typography>
          <Typography level="body-md">
            To provide the gaming experience, we collect:
          </Typography>
          <List marker="disc" sx={{ pl: 2 }}>
            <ListItem><strong>Account Data:</strong> Login, email, and hashed/salted passwords [7].</ListItem>
            <ListItem><strong>Profile Data:</strong> Avatars and game statistics (wins/losses) [6].</ListItem>
            <ListItem><strong>Social Data:</strong> Friends list and <strong>persistent chat history</strong> [9].</ListItem>
            <ListItem><strong>OAuth Data:</strong> Public info from the 42 Intra profile if used for login [12].</ListItem>
          </List>
        </Box>

        <Box>
          <Typography level="h4">2. Data Usage</Typography>
          <Typography level="body-md">
            Data is used strictly to manage your account, facilitate real-time matchmaking via <strong>WebSockets</strong>, and display rankings on the leaderboard [4, 5].
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">3. Data Security</Typography>
          <Typography level="body-md">
            All data is stored in a structured <strong>SQLite database</strong> [7]. External transmissions are protected by <strong>HTTPS</strong> to ensure data integrity during your session.
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">4. User Rights (GDPR Inspired)</Typography>
          <Typography level="body-md">
            In compliance with the project requirements, users may request to view their stored data or request its complete <strong>deletion</strong> from our system [13].
          </Typography>
        </Box>

        <Box>
          <Typography level="h4">5. Cookies</Typography>
          <Typography level="body-md">
            We use <code>express-session</code> cookies to maintain your login status across the application, which is essential for multi-user support [2, 14].
          </Typography>
        </Box>
      </Stack>
    </Sheet>
  );
};