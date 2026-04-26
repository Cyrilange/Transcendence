const express = require('express')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const db = require('../database')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { login, email, password } = req.body

  if (!login || !email || !password)
    return res.status(400).json({ error: 'login, email and password are required' })

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' })

  try {
    const salt = await bcrypt.genSalt(12)
    const password_hash = await bcrypt.hash(password, salt)

    db.prepare(`
      INSERT INTO users (login, email, password_hash)
      VALUES (?, ?, ?)
    `).run(login, email, password_hash)

    res.json({ success: true, message: 'Account created' })
  } catch (err) {
    if (err.message.includes('UNIQUE'))
      return res.status(409).json({ error: 'Login or email already taken' })
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' })

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

    if (!user || !user.password_hash)
      return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' })

    req.session.user = {
      id: user.id,
      login: user.login,
      email: user.email,
      avatar: user.avatar
    }

    res.json({ success: true, user: req.session.user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true, message: 'Logged out' })
})

router.get('/me', (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not logged in' })
  res.json(req.session.user)
})

router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    response_type: 'code'
  })
  res.redirect(`https://api.intra.42.fr/oauth/authorize?${params}`)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code
  if (!code)
    return res.status(400).json({ error: 'No code provided' })

  try {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI
    })

    const token = response.data.access_token
    const userRes = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const user = userRes.data

    db.prepare(`
      INSERT INTO users (login, email, avatar)
      VALUES (?, ?, ?)
      ON CONFLICT(login) DO UPDATE SET
        email = excluded.email,
        avatar = excluded.avatar
    `).run(user.login, user.email, user.image.link)

    req.session.user = {
      login: user.login,
      email: user.email,
      avatar: user.image.link
    }

    res.redirect('/')
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router