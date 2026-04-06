const express = require('express')
const axios = require('axios')
const db = require('../database')
const router = express.Router()

router.get('/login', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code'
    })
    res.redirect(`https://api.intra.42.fr/oauth/authorize?${params}`)
})

router.get('/', async (req, res) => {
    const code = req.query.code
    if (!code)
        return res.status(400).json({ error: 'No code provided' })
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
        res.json({ login: user.login, email: user.email, avatar: user.image.link })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.json({ message: 'Logged out' })
})

module.exports = router