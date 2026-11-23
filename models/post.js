const pool = require ("../db/config");

async function getAllPost(filters = {}) {
    let sql = 'SELECT * FROM posts WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if(filters.title){
        sql += ` AND name ILIKE $${paramIndex}`;
        values.push(`%${filters.name}%`);
        paramIndex++;
    }
    if(filters.published){
        sql += ` AND published = $${paramIndex}`;
    }
    if(filters.author_id){
        sql += ` AND author_id = $${paramIndex}`;
    }
    sql += ` ORDER BY id ASC`;

    const res = await pool.query(sql, values);
    return res.rows;
}

async function getPostsByID (id){
    const res = await pool.query('SELECT * FROM posts WHERE id = $1;', [id]);
    return res.rows[0];
}

async function getPostsAuthor(id){
    const res = await pool.query('SELECT p.*, a.id AS author_id, a.name AS author_name FROM posts AS p LEFT JOIN authors as a ON a.id = p.author_id WHERE p.id = 1', [id]);
    return res.rows[0];
}

async function createPost(title, content, published){
    const res = await pool.query('INSERT INTO posts (tittle, content, published) VALUES ($1, $2, $3) RETURNING *', [title,content, published]);
    return res[0];
}

async function replacePost (id, title, content, published){
    const res = await pool.query('UPDATE posts SET title = $2, content = $3, published = $4 WHERE id = $1 RETURNING *;',[id, title, content, published]);
    return res.rows[0];
}

async function updateAuthor (id, title, content, published){
    const res = await pool.query('UPDATE authors SET title = COALESCE ($2,title), content = COALESCE ($3,content), published = COALESCE ($4,published) WHERE id = $1 RETURNING *;',[id, title, content, published]);
    return res.rows[0];
}

async function deletePosts (id){
    const res = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *;',[id]);
    return res.rows[0];
}
module.exports = {
    getAllPost,
    getPostsByID,
    getPostsAuthor,
    createPost,
    replacePost,
    updateAuthor,
    deletePosts
};