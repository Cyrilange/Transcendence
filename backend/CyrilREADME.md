## backend with node.js using express as a framework
 _npm install express --save_

 tested with localhost , route : exemple,  http://localhost:3000/test
 console.log is hello world
 the function use get , return res.json so the data are parsed in Json 
 here we do not need req but we have to write it 
 there is two args, the first is the route : '/test'
 the second is (req and res) , res is to return the result and req can be for exemple to be abble to find a user via params.id
 

 app.get('/test', (req, res) => {
	res.send('hello world')
  })

### Run server

```
node server.js
```

Server runs on: (for now ) 

```
http://localhost:3000
```

---

## test 

curl http://localhost:3000/test

## test db 

curl http://localhost:3000/db-test

## login

http://localhost:3000/login 

## check our log

http://localhost:3000/user/check 

## log out

http://localhost:3000/logout 

## dependencies
_npm install express axios body-parser dotenv_ for API42  
_npm install better-sqlite3_ for database
_npm install express-session_ to keep session open 



## 📌 Overview

This project implements the backend for a **Top Trumps-style card game** as part of the Transcendence project.
Players compete by comparing stats on cards, and the winner collects them.

The backend is built with **Node.js + Express** and integrates with the **42 API** for user data.

---

##  Tech Stack

* Node.js
* Express
* Axios (API calls)
* dotenv (environment variables)
* WebSockets / Socket.io for real-time gameplay

---

##  Authentication

* Uses **42 API (OAuth2)**


---

##  Project Structure

```
backend/
├── server.js        # main Express server
├── auth.js          # token (42 API)
├── callApi.js       # API 42 calls
├── routes/          # endpoints ( i dont know yet if i ll will use it ) 
├── .env             # secrets (client_id, client_secret)
├── package.json
```

---



##  API Endpoints

###  Users

ex:
GET    /user/:login        → fetch user from 42 API
POST   /user               → create user (future DB)
GET    /users              → list users


### Cards

```
GET    /cards              → list all cards
GET    /cards/:id          → get one card
POST   /cards              → create a card
```



###  Game

```
POST   /game               → create a game
GET    /game/:id           → game state
POST   /game/:id/join      → join game
POST   /game/:id/start     → start game
```

---

###  Gameplay

```
GET    /game/:id/hand              → player cards
POST   /game/:id/play              → play a card
POST   /game/:id/choose-stat       → choose stat
GET    /game/:id/result            → round result
```

---

###  Matchmaking 

```
POST   /matchmaking/join
GET    /matchmaking/status
```

---

##  Game Flow

```
1. User logs in (42 API)
2. Create / join game
3. Game starts
4. Cards distributed
5. Player selects stat
6. Cards compared
7. Winner collects cards
8. Repeat until one player wins
```

---


##  Important Notes

* Do NOT commit `.env`
{

      this will need to be delete before sent 

      :
}
* Token is required for all 42 API calls
* Real-time gameplay will require **WebSockets**

---

##  Next Steps

* Add database (PostgreSQL / Prisma)
* Implement full OAuth (login with 42)
* Add game persistence
* Implement real-time gameplay with Socket.io
* Add matchmaking system

---

##  Author

Backend development for Transcendence project.
