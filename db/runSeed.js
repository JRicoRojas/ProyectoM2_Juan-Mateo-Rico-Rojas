const fs = require('fs');
const path = require ('path');
const pool = require('./config');

async function runSeed() {
    const sql = fs.readFileSync(path.join(__dirname,'seed.sql'),'utf8');
    await pool.query(sql);
}

module.exports = runSeed;