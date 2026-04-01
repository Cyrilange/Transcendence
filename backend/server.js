const express = require('express')
const { getUser } = require('./callApi')
const app = express()
const port = 3000
app.use(express.json())
const db = require('./database')

app.get('/user/:login', async (req, res) => { // exemple /user/csalamit
  try { 
    const data = await getUser(req.params.login) //endpoint  .login
    res.json(data.login) // format json as node.js work like that
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || err.message)
  }
})

app.get('/db-test', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
      if (err)
          return res.status(500).json({ error: err.message })
      res.json(rows)
  })
})


//################################TEST#################################################
app.get('/test', (req, res) => {
	res.send('hello world')
  })

  app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`))
//################################END OF TEST#################################################


