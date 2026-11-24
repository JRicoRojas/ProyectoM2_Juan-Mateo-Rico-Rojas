const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.error('Error critico: La variable de entorno DATABASE_URL no esta definida');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Solo hace falta con algunas bases externas (por ejemplo la URL publica de Railway)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

module.exports = pool;