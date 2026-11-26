const pool = require ("../db/config");

async function getAllPosts(filters = {}) {
    let sql = 'SELECT * FROM posts WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if(filters.title){
        sql += ` AND title  ILIKE $${paramIndex}`;
        values.push(`%${filters.title}%`);
        paramIndex++;
    }
    if(filters.published){
        sql += ` AND published = $${paramIndex}`;
        values.push(filters.published);
        paramIndex++;
    }
    if(filters.author_id){
        sql += ` AND author_id = $${paramIndex}`;
        values.push(filters.author_id);
        paramIndex++;
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
    const res = await pool.query('SELECT p.*, a.name AS author_name, a.email AS author_email FROM posts AS p LEFT JOIN authors as a ON a.id = p.author_id WHERE p.id = $1', [id]);
    return res.rows[0];
}

async function createPost(title, content, published, author_id){
    const res = await pool.query('INSERT INTO posts (title, content, published, author_id) VALUES ($1, $2, COALESCE ($3,true), $4) RETURNING *', [title,content, published, author_id]);
    return res.rows[0];
}

async function replacePost (id, title, content, published, author_id){
    const res = await pool.query('UPDATE posts SET title = $2, content = $3, published = COALESCE ($4,true), author_id = $5 WHERE id = $1 RETURNING *;',[id, title, content, published, author_id]);
    return res.rows[0];
}

async function updatePost (id, title, content, published, author_id){
    const res = await pool.query('UPDATE posts SET title = COALESCE ($2,title), content = COALESCE ($3,content), published = COALESCE ($4,published), author_id = COALESCE ($5,author_id) WHERE id = $1 RETURNING *;',[id, title, content, published, author_id]);
    return res.rows[0];
}

async function deletePosts (id){
    const res = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *;',[id]);
    return res.rows[0];
}
module.exports = {
    getAllPosts,
    getPostsByID,
    getPostsAuthor,
    createPost,
    replacePost,
    updatePost,
    deletePosts
};