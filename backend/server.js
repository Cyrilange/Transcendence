require('dotenv').config()
const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000

app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use('/', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/db', require('./routes/db'))

app.get('/test', (req, res) => res.send('hello world'))

app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`))