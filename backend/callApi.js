const axios = require('axios')
const { getToken } = require('./auth')

async function getUser(login) {
  const token = await getToken()
  try {
    const res = await axios.get(`https://api.intra.42.fr/v2/users/${login}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (err) {
    throw err
  }
}

module.exports = { getUser }