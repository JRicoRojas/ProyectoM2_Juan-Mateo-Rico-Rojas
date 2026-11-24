const fs = require('fs');
const path = require('path');
const pool = require('./config');

async function runFile(name) {
    const sql = fs.readFileSync(path.join(__dirname, name), 'utf8');
    await pool.query(sql);
    console.log(`Ejecutado: ${name}`);
}

async function main() {
    await runFile('schema.sql');
    if (!process.argv.includes('--no-seed')) {
        await runFile('seed.sql');
    }
}

main()
    .then(() => pool.end())
    .catch(async (err) => {
        console.error('Error al inicializar la base de datos:', err.message);
        await pool.end();
        process.exit(1);
    });
