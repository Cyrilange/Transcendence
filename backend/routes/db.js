const express = require('express')
const db = require('../database')
const router = express.Router()

router.get('/test', (req, res) => {
    const rows = db.prepare('SELECT * FROM users').all()
    res.json(rows)
	console.log(`here is the db : ${rows}`)
})

module.exports = router