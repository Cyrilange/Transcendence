const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');

router.get('/leaderboard', requireAuth, (req, res) => {
  res.json({ message: 'leaderboard coming soon' });
});

module.exports = router;