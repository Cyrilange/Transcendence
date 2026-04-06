const express = require('express')
const { getUser } = require('../callApi')
const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/check', (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ error: 'Not logged in' })
    res.json(req.session.user)
})

router.get('/:login', async (req, res) => {
    try {
        const data = await getUser(req.params.login)
        res.json(data.login)
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || err.message)
    }
})

router.get('/profil', requireAuth, (req, res) => {
    res.json(req.session.user)
	
	
})


module.exports = router