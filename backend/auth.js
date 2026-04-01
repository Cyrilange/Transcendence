require('dotenv').config()
const axios = require('axios')

async function getToken() {
  try {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
    return response.data.access_token
  } catch (err) {
    console.error(err.response?.data || err.message)
  }
}

module.exports = { getToken }