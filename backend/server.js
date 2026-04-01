require('dotenv').config()
const express = require('express')
const axios = require('axios')
const db = require('./database')
const { getUser } = require('./callApi')

const app = express()
const port = 3000
app.use(express.json())

app.get('/auth/login', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code'
    })
    res.redirect(`https://api.intra.42.fr/oauth/authorize?${params}`)
})

app.get('/', async (req, res) => {
  const code = req.query.code
  if (!code)
      return res.send('hello world')
  try {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', {
          grant_type: 'authorization_code',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.REDIRECT_URI
      })
      const token = response.data.access_token
      const userRes = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${token}` }
      })
      const user = userRes.data
      res.json({ login: user.login, email: user.email, avatar: user.image.link })
  } catch (err) {
      res.status(500).json({ error: err.message })
  }
})

app.get('/user/:login', async (req, res) => {
    try {
        const data = await getUser(req.params.login)
        res.json(data.login)
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || err.message)
    }
})

app.get('/db-test', (req, res) => {
    const rows = db.prepare('SELECT * FROM users').all()
    res.json(rows)
})

app.get('/test', (req, res) => {
    res.send('hello world')
})

app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`))