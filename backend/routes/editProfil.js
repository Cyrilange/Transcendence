const express = require('express');
const router = express.Router();
const db = require('../database');

router.put('/login', (req, res) => {
  console.log("LOGIN ROUTE HIT", req.body);
  const { currentLogin, newLogin } = req.body;
  

  try {
    const result = db.prepare(`
      UPDATE users
      SET login = ?
      WHERE login = ?
    `).run(newLogin, currentLogin);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // update for refresh
    if (req.session && req.session.user) {
      req.session.user.login = newLogin;
      
      req.session.save((err) => {
        if (err) {
          console.error("Erreur save session:", err);
          return res.status(500).json({ error: "Session save failed" });
        }
        return res.json({ success: true });
      });
    } else {
      return res.json({ success: true });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;