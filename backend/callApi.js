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

class ApiService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
    this.baseUrl = process.env.FORTY_TWO_API_URL;
    console.log("BASE URL =", this.baseUrl);
  }

  async getToken() {
    if (this.token && this.tokenExpiry > Date.now()) {
      return this.token;
    }

    const response = await axios.post(
      `${this.baseUrl}/oauth/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      })
    );

    this.token = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    return this.token;
  }

  async fetchUsers(totalCards = 150, campusId = 37) {
    const token = await this.getToken();

    const pageNumbers = [];
    while (pageNumbers.length < 5) {
      const page = Math.floor(Math.random() * 15) + 1;
      if (!pageNumbers.includes(page)) pageNumbers.push(page);
    }

    console.log('Fetching pages:', pageNumbers);

    const pages = await Promise.all(
      pageNumbers.map(pageNum =>
        axios.get(`${this.baseUrl}/v2/campus/${campusId}/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            'page[size]': 50,
            'page[number]': pageNum,
            'filter[kind]': 'student'
          }
        }).then(r => Array.isArray(r.data) ? r.data : [])
          .catch(() => [])
      )
    );

    const allUsers = pages.flat();
    const unique = [...new Map(allUsers.map(u => [u.id, u])).values()];
    const shuffled = [...unique].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, totalCards);

    console.log(`Collected ${selected.length} users from ${pages.length} pages`);
    return selected;
  }
}

module.exports = new ApiService();