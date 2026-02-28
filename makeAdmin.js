// Run this ONCE to make yourself admin after registering
// Usage: node makeAdmin.js your@email.com

const fs = require('fs')
const path = require('path')

const email = process.argv[2]
if (!email) { console.log('Usage: node makeAdmin.js your@email.com'); process.exit(1) }

const USERS_FILE = path.join(__dirname, 'data', 'users.json')
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
const idx = users.findIndex(u => u.email === email)

if (idx === -1) { console.log('User not found. Register first at /auth'); process.exit(1) }

users[idx].isAdmin = true
fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
console.log(`✓ ${users[idx].name} (${email}) is now an Admin!`)
console.log('Restart the server and log out/in for changes to take effect.')