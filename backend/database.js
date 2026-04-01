const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, 'data', 'transcendence.db')

const db = new Database(DB_PATH)

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    login       TEXT UNIQUE NOT NULL,
    email       TEXT,
    avatar      TEXT,
    wins        INTEGER DEFAULT 0,
    losses      INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
)`)

console.log('Connected to SQLite database')

module.exports = db