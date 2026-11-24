const pool = require ("../db/config");

async function getAllComments(filters = {}) {
    let sql = 'SELECT * FROM comments WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if(filters.author_id){
        sql += ` AND author_id = $${paramIndex}`;
        values.push(filters.author_id);
        paramIndex++;
    }

    if(filters.post_id){
        sql += ` AND post_id = $${paramIndex}`;
        values.push(filters.post_id);
        paramIndex++;
    }

    sql += ` ORDER BY id ASC`;

    const res = await pool.query(sql, values);
    return res.rows;
}

async function getCommentByID (id){
    const res = await pool.query('SELECT * FROM comments WHERE id = $1;', [id]);
    return res.rows[0];
}

async function getCommentsAuthor(id){
    const res = await pool.query('SELECT c.*, a.name AS author_name, a.email AS author_email FROM comments AS c LEFT JOIN authors as a ON a.id = c.author_id WHERE c.id = $1', [id]);
    return res.rows[0];
}

async function getCommentsPost(id){
    const res = await pool.query('SELECT c.*, p.title AS post_title FROM comments AS c LEFT JOIN posts as p ON p.id = c.post_id WHERE c.id = $1', [id]);
    return res.rows[0];
}

async function createComment(content, author_id, post_id){
    const res = await pool.query('INSERT INTO comments (content, author_id, post_id) VALUES ($1, $2, $3) RETURNING *', [content, author_id, post_id]);
    return res.rows[0];
}

async function replaceComment(id, content, author_id, post_id){
    const results = await pool.query('UPDATE comments SET content = $2, author_id = $3, post_id = $4 WHERE id = $1 RETURNING *;',[id, content, author_id, post_id]);
    return results.rows[0];
}

async function updateComment(id, content, author_id, post_id){
    const results = await pool.query('UPDATE comments SET content = COALESCE ($2,content), author_id = COALESCE ($3,author_id), post_id = COALESCE ($4,post_id) WHERE id = $1 RETURNING *;',[id, content, author_id, post_id]);
    return results.rows[0];
}

async function deleteComment (id){
    const results = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *;',[id]);
    return results.rows[0];
}
module.exports = {
    getAllComments,
    getCommentByID,
    getCommentsAuthor,
    getCommentsPost,
    createComment,
    replaceComment,
    updateComment,
    deleteComment,
};