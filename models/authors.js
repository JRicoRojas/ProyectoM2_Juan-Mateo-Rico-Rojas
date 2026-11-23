const pool = require ("../db/config");

async function getAllAuthors(filters = {}){
    let sql = 'SELECT * FROM authors WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.name){
        sql += ` AND name ILIKE $${paramIndex}`;
        values.push(`%${filters.name}%`);
        paramIndex++;
    }
    if(filters.email){
        sql += ` AND email = $${paramIndex}`;
        values.push(filters.email);
        paramIndex++;
    }
    sql += ` ORDER BY id ASC`;

    const results = await pool.query(sql, values);
    return results.rows;
}

async function getAuthorsByID (id){
    const results = await pool.query('SELECT * FROM authors WHERE id = $1;', [id]);
    return results.rows[0];
}

async function createAuthor (name, email, bio){
    const results = await pool.query('INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *;',[name, email, bio]);
    return results.rows[0];
}

async function replaceAuthor (id, name, email, bio){
    const results = await pool.query('UPDATE authors SET name = $2, email = $3, bio = $4 WHERE id = $1 RETURNING *;',[id, name, email, bio]);
    return results.rows[0];
}

async function updateAuthor (id, name, email, bio){
    const results = await pool.query('UPDATE authors SET name = COALESCE ($2,name), email = COALESCE ($3,email), bio = COALESCE ($4,bio) WHERE id = $1 RETURNING *;',[id, name, email, bio]);
    return results.rows[0];
}

async function deleteAuthor (id){
    const results = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *;',[id]);
    return results.rows[0];
}

module.exports = {
    getAllAuthors,
    getAuthorsByID,
    createAuthor,
    replaceAuthor,
    updateAuthor,
    deleteAuthor,
};