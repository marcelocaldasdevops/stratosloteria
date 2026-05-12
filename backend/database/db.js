const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'db.json');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

// Initialize database
db.defaults({ games: [] }).write();

console.log('Database initialized: db.json ready.');

module.exports = db;
