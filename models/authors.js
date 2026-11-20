const pool = require ("../db/config");

async function getAllAuthors(filters = {}){
    let sql = 'SELECT * FROM categories WHERE 1=1';
    const values = [];
    paramIndex = 1;

    if (filters.name){
        sql += ` AND name = $${paramIndex}`;
        values.push(filters.name);
        paramIndex++;
    }
    if(filters.email){
        sql += ` AND email = $${paramIndex}`;
        values.push(filters.email)
        paramIndex++;
    }
    sqñ ` ORDER BY ASC`;
    const results = await pool.query(sql.values);
    return(results.rows);
}
