_This project has been created as part of the 42 curriculum by csalamit, aternero, aehrl, sstoev_

# DESCRIPTION


#### roles

###### -aehrl PO . Developers

Defines the product vision, prioritizes features, and ensures the project meets user needs.

logic of the game  , fronted + backend inplementation of the game 


###### -csalamit PM . Developers

team coordination and removes obstacles.

Docker + backend supervisor


###### -aternero . Developers

Specialist of UI/UX , unit tests


###### -sstoev . Developers

Specialist of backend

#### General requirements
-  The project must be a web application, and requires a frontend, backend, and a database.
-  Git must be used with clear and meaningful commit messages. The repository must show: 
	- Commits from all team members. 
	- Clear commit messages describing the changes. 
	- Proper work distribution across the team
- Deployment must use a containerisation solution (Docker, Podman, or equiva- lent) and run with a single command.
- No warnings or errors should appear in the browser console.
- The project must include accessible Privacy Policy and Terms of Service pages with relevant content.
	- GDPA rules should apply
	- Privacy Policy and Terms of Service: These pages will be verified during evaluation. They must: 
		- Be easily accessible from the application (e.g., footer links). GDPA dictates within 2 clicks
		- Contain relevant and appropriate content for your project.
		- Not be placeholder or empty pages.
	- Missing or inadequate Privacy Policy/Terms of Service pages will result in project rejection
- Multi-user Support (Mandatory): Your website must support multiple users simultaneously. This is a core requirement of the project. Users should be able to interact with the application at the same time without conflicts or performance issues. This includes:
	- Multiple users can be logged in and active at the same time. 
	- Concurrent actions by different users are handled properly. 
	- Real-time updates are reflected across all connected users when applicable. 
	- No data corruption or race conditions occur with simultaneous user actions.
#### Technical requirements
-  A frontend that is clear, responsive, and accessible across all devices. 
- Use a CSS framework or styling solution of your choice (e.g., Tailwind CSS, Bootstrap, Material-UI, Styled Components, etc.).
- Store credentials (API keys, environment variables, etc.) in a local .env file that is ignored by Git, and provide an .env.example file.
- The database must have a clear schema and well-defined relations.
- Your application must have a basic user management system. Users must be able to sign up and log in securely:
	- At minimum: email and password authentication with proper security (hashed passwords, salted, etc.). 
	- Additional authentication methods (OAuth, 2FA, etc.) can be implemented via modules.
- All forms and user inputs must be properly validated in both the frontend and backend.
- For the backend, HTTPS must be used everywhere

> What is a Framework? For this project, a framework is defined as a comprehensive tool that provides: • A structured architecture and conventions for organising code. • Built-in features for common tasks (routing, state management, etc.). • A complete ecosystem of tools and libraries. Examples: • Frontend frameworks: React, Vue, Angular, Svelte, Next.js (these are frameworks). • Backend frameworks: Express, Fastify, NestJS, Django, Flask, Ruby on Rails. • Not frameworks: jQuery (library), Lodash (utility library), Axios (HTTP client). Note: React is considered a framework in this context due to its ecosystem and architectural patterns, even though it is technically a library.

## Modules
You will need to earn 14 points in total to complete your project. Each major module is worth 2 points, and each minor module is worth 1 point.

### Gaming and user experience (8 Points)
#### Major 1 - Game
Implement a complete web-based game where users can play against each other. 
- The game can be real-time multiplayer (e.g., Pong, Chess, Tic-Tac-Toe, Card games, etc.).  TopTrunks Game!!!
- Players must be able to play live matches.
- The game must have clear rules and win/loss conditions.
- The game can be 2D or 3D. (2D)
#### Major 2 - Remote players
Remote players — Enable two players on separate computers to play the same game in real-time. 
- Handle network latency and disconnections gracefully. (have 30s countdown before abandon game)
- Provide a smooth user experience for remote gameplay.
- Implement reconnection logic. (has to reconnect within 30 sec)
#### Major 3 - Multiplayer
Multiplayer game (more than two players). 
- Support for three or more players simultaneously.
- Fair gameplay mechanics for all participants.
- Proper synchronisation across all clients

#### Minor 1 - Game customisation
Game customisation options.
 - Power-ups, attacks, or special abilities.
 - Different maps or themes.
	 - Player can select Custom Deck (coalitions) or playmat backgroung
 - Customisable game settings.
	 - default (all cards must be won)
	 - Round based (best of n rounds)
	 - First to Win n rounds
 - Default options must be available.
#### Minor 2 - Gamification system 
A gamification system to reward users for their actions.
- Implement at least 3 of the following: achievements, badges, leaderboards, XP/level system, daily challenges, rewards
	- XP/Level, Rewards (decks & Customisation), Achievements
- System must be persistent (stored in database)
- Visual feedback for users (notifications, progress bars, etc.)
- Clear rules and progression mechanics


### Web ( 4 Points)
#### Major - Framework Front & Backend
Use a framework for both the frontend and backend. 
- Use a frontend framework (React, Vue, Angular, Svelte, etc.).
- Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails, etc.).
- Full-stack frameworks (Next.js, Nuxt.js, SvelteKit) count as both if you use both their frontend and backend capabilities
#### Minor - Custom-made design system
Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components).

#### Minor - Search system (search your cards?)
Implement advanced search functionality with filters, sorting, and pagination

#### Major 3 - API (OHH MAYBE NO)
A public API to interact with the database with a secured API key, rate limiting, documentation, and at least 5 endpoints: 
- GET /api/{something} 
- POST /api/{something} 
- PUT /api/{something} 
- DELETE /api/{something}

### Accessibility and Internationalisation ( 1 - 2 Points)
#### Minor - Language (Spanish, English, German)
Support for multiple languages (at least 3 languages).
- Implement i18n (internationalization) system. 
- At least 3 complete language translations. 
- Language switcher in the UI. 
- All user-facing text must be translatable.

#### Minor - Additional browser support
Support for additional browsers.
- Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge, etc.).
- Test and fix all features in each browser.
- Document any browser-specific limitations.
- Consistent UI/UX across all supported browsers.
### User Management (2 - 4 Points)
#### Minor - Game stats & History
Game statistics and match history (requires a game module).
- Track user game statistics (wins, losses, ranking, level, etc.).
- Display match history (1v1 games, dates, results, opponents).
- Show achievements and progression. 
- Leaderboard integration
#### Minor - 2.0 Auth (Have to be in 42 to play??)
Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.).
#### Minor - 2FA
Implement a complete 2FA (Two-Factor Authentication) system for the users
#### Minor - Activity & Analytics (maybe)
User activity analytics and insights dashboard.

### AI (2 Points)
#### Major - AI opponent
Introduce an AI Opponent for games.
- The AI must be challenging and able to win occasionally. 
- The AI should simulate human-like behaviour (not perfect play).
- If you implement game customisation options, the AI must be able to use them. 
	- Can choose deck / play mat  Background
- You must be able to explain your AI implementation during evaluation.
### Devops ()

### Data and Analytics (1 Point)
#### Minor 1 - GDPR features
GDPR compliance features.
- Allow users to request their data.
- Data deletion with confirmation. 
- Export user data in a readable format.
- Confirmation emails for data operations



### Team Information
csalamit : 
Aternero : 
ssive7b : Developer (backend testing, security & tooling)


### Individual Contributions

- **ssive7b**: backend test coverage (game logic, round mechanics, authentication), HTTPS trust configuration, and containerized test tooling.


### Project Management:

### Technical Stack:
frontend : mui / react and axios for api
backend : express , node.js
container : docker and docker compose
nginx for https

### Database Schema



The application uses a single SQLite database (`data/transcendence.db`).

#### Table: `users`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| `login` | TEXT | UNIQUE, NOT NULL | 42 login or chosen username |
| `email` | TEXT | UNIQUE | User email address |
| `password_hash` | TEXT | nullable | bcrypt hash (null for OAuth 42 users) |
| `avatar` | TEXT | nullable | URL to user avatar image |
| `wins` | INTEGER | DEFAULT 0 | Number of games won |
| `losses` | INTEGER | DEFAULT 0 | Number of games lost |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation date |

#### Notes

- Users authenticated via **OAuth 42** have `password_hash = NULL` and their avatar is fetched from the 42 API.
- Users authenticated via **email/password** have their password stored as a **salted bcrypt hash** (cost factor 12).
- Game state is stored **in memory** during a session and is not persisted to the database.

# INSTRUCTIONS

# RULES OF THE GAME 

Each player have 25 cards
max 4 players
each player have 3 differents atatcks, wallet point and start date 
you can only see your cards and only the one you playing with 
lets say you click on wallet , if you have a bigger wallet than the ooponent you win the round 
when a round is lost you loose your turn 
cards go to the pile then they are given


### TopTrumps 42 (2D)
- [[Top trump rules]]
- There are multiple deck options (we can unlock these through wins).
	- Each Deck consists of the students of that campus in that rank
	- Eg. Starter Deck is Milestone one students in Malaga
		- Next progression is Milestone two in Malaga
		- And so on.
		- Once we have achieved getting all decks in Malaga another campus is unlocked, and we continue with the progression module there
	- The deck gets randomly generated at the start of the game (this makes it more interactive and less predictable with who you will play)
		- also the cards can update, if a student passes to the next milestone they now will be in the next level deck


### Run server

```
node server.js
```

Server runs on: (for now ) 

```
http://localhost:3001 , https://localhost:8443

or simply do make or make re
```

---

## test 

curl http://address/test

## test db 

curl http://address/db-test
curl -k https://address/api/db/test
curl -k [https://ip]/api/db/test

## login

http://address/login 

ex : 
[{"id":1,"login":"csalamit","email":"csalamit@student.42malaga.com","avatar":"https://cdn.intra.42.fr/users/e055434fffd508090707832514056f61/csalamit.jpg","wins":0,"losses":2,"created_at":"2026-04-24 11:39:13","password_hash":null}]

## check our log

http://address/user/check 

## log out

http://address/logout 

## dependencies
_npm install express axios body-parser dotenv_ for API42  
_npm install better-sqlite3_ for database
_npm install express-session_ to keep session open 

## cert for htpps 

mkdir -p nginx/certs
cd nginx/certs

openssl req -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout key.pem \
-out cert.pem



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

##  Author

Backend development for Transcendence project.
sudo apt-get install -y mkcert libnss3-tools
mkcert -install
mkcert localhost 127.0.0.1
mv localhost+1.pem ~/Transcendence/nginx/certs/cert.pem
mv localhost+1-key.pem ~/Transcendence/nginx/certs/key.pem



# RESSOURCE

## Documentation

* [42 API Documentation](https://api.intra.42.fr/apidoc) : Official documentation for the 42 API, essential for integrating user authentication and data retrieval.
* [Doc React](https://es.react.dev/) : Official React documentation, a great resource for learning React concepts and best practices.
* [Docker](https://docs.docker.com/) : Official Docker documentation for containerization and deployment.
* [Express framework](https://expressjs.com/) : Express.js documentation, a minimal and flexible Node.js web application framework.
* [GitHub](https://docs.github.com/en) : GitHub documentation for version control and collaboration.
* [Material UI / MUI](https://mui.com/) : A popular React UI framework with a comprehensive set of pre-built components and a customizable design system.
* [Node.js](https://nodejs.org/en/docs/) : Official Node.js documentation, essential for backend development with Express.

## Learning Resources

* [Aprendiendo Git y GitHub: Desde cero hasta buenas prácticas y estrategias de trabajo en equipo](https://www.amazon.es/Aprendiendo-Git-GitHub-pr%C3%A1cticas-estrategias/dp/B0D2LPMG6F?ie=UTF8&tag=hydes-21&hvadid=722222742463&hvpos=&hvexid=&hvnetw=g&hvrand=7550724054302413617&hvpone=&hvptwo=&hvqmt=&hvdev=c&ref=pd_sl_21gxdi1o00_e&tag=&ref=&adgrpid=168856555894&hvpone=&hvptwo=&hvadid=722222742463&hvpos=&hvnetw=g&hvrand=7550724054302413617&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9197933&hvtargid=dsa-1595363597442&hydadcr=&mcid=&gad_source=1) : A comprehensive guide to learning Git and GitHub, covering everything from basic commands to advanced workflows and best practices for team collaboration.
* [W3Schools](https://www.w3schools.com/) : A comprehensive resource for learning web development technologies, including HTML, CSS, JavaScript, and more.
	* [HTML](https://www.w3schools.com/html/default.asp) : Learn the basics of HTML for structuring web pages.
	* [CSS](https://www.w3schools.com/css/default.asp) : Learn how to style web pages using CSS.
	* [JavaScript](https://www.w3schools.com/js/default.asp) : Learn JavaScript for adding interactivity to web pages.
	* [React](https://www.w3schools.com/react/default.asp) : A beginner-friendly introduction to React.js.
	* [Node.js](https://www.w3schools.com/nodejs/default.asp) : Learn Node.js for server-side development.

## Communication Tools

* [Slack](https://slack.com/) : For team communication and collaboration.
* [WhatsApp](https://www.whatsapp.com/) : For team communication and coordination.

## Project Management Tools

* [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) : For project management and task tracking using GitHub's built-in project boards.
