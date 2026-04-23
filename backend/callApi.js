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

  // Get or refresh OAuth token
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
    // Token expires in 7200s — store expiry with 60s buffer
    this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    return this.token;
  }

  // Fetch users from a specific campus
  async fetchUsers(totalCards = 30, campusId = 37) {
    const token = await this.getToken();

   // Pick 3 random page numbers spread across the user base
    const pageNumbers = [];
    while (pageNumbers.length < 3) {
      const page = Math.floor(Math.random() * 20) + 1; // pages 1-20
      if (!pageNumbers.includes(page)) pageNumbers.push(page);
    }
  console.log('Fetching pages:', pageNumbers);
  // Fetch all 3 pages in parallel
  const pages = await Promise.all(
    pageNumbers.map(pageNum =>
      axios.get(`${this.baseUrl}/v2/campus/${campusId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          'page[size]': 50,
          'page[number]': pageNum,
          'filter[kind]': 'student'
        }
      }).then(r => r.data)
    )
  );

  // Pick 10 random users from each page
  const cardsPerPage = Math.floor(totalCards / pages.length);
  const selected = pages.flatMap(page => {
    const list = Array.isArray(page) ? page : [];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, cardsPerPage);
  });

  console.log(`Collected ${selected.length} users from ${pages.length} pages`);
  return selected;
  }
    
}

module.exports = new ApiService();