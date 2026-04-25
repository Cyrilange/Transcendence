const express = require('express');
const router = express.Router();
const db = require('../database');
const { getUser } = require('../callApi');
const requireAuth = require('../middleware/auth');


router.get('/check', (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ error: 'Not logged in' });
    res.json(req.session.user);
});

router.get('/profil', requireAuth, (req, res) => {
    res.json(req.session.user);
});


router.put('/login', (req, res) => {
    console.log("LOGIN ROUTE HIT", req.body);
    const { currentLogin, newLogin } = req.body;
    try {
      const result = db.prepare(`
        UPDATE users SET login = ? WHERE login = ?
      `).run(newLogin, currentLogin);
  
      if (result.changes === 0)
        return res.status(404).json({ error: 'User not found' });
  
      if (req.session?.user) {
        req.session.user.login = newLogin;
        req.session.save((err) => {
          if (err) return res.status(500).json({ error: 'Session save failed' });
          return res.json({ success: true });
        });
      } else {
        res.json({ success: true });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });


router.get('/:login', async (req, res) => {
    try {
        const data = await getUser(req.params.login);
        res.json(data.login);
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || err.message);
    }
});

module.exports = router;