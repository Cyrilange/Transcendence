const requireAuth = require('../middleware/auth')


router.get('/leaderboard', requireAuth, (req, res) => {
    // seulement accessible si connecté
})