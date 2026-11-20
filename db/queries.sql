-- QUERIES PARA authors
--GET /authors

SELECT * FROM authors;

--GET /authors/:id 

SELECT * FROM authors
WHERE id = 1;

--POST /authors

INSERT INTO authors (name, email, bio) VALUES
('nametest','tes@test.com','biotest')
RETURNING *;

--PUT /authors/:id

UPDATE authors 
SET name = 'Unametest', email = 'Utest@test.com', bio = 'Ubiotest'
WHERE id = 6
RETURNING *;

--PATCH /authors/:id

UPDATE authors
SET
    name = COALESCE ('Pnametest',name),
    email = COALESCE ('Ptest@test.com',email),
    bio = COALESCE ('Ptest',bio)
WHERE id = 6
RETURNING *;

-- DELETE /authors/:id

DELETE FROM authors
WHERE id = 6
RETURNING *;

-- CHECK TABLE AGAIN

SELECT * FROM authors;

-- QUERIES PARA posts
--GET /posts

SELECT * FROM posts;

--GET /posts/:id 

SELECT * FROM posts
WHERE id = 1;

--POST /posts

INSERT INTO posts (title, content, author_id,published) VALUES
('titletest','contenttest',1, TRUE)
RETURNING *;

--PUT /posts/:id

UPDATE posts 
SET title = 'PUTtitletest', content = 'PUTcontenttest', author_id = 1, published = TRUE
WHERE id = 6
RETURNING *;

--PATCH /posts/:id

UPDATE posts
SET
    title = COALESCE ('PATCHtittletest',title),
    content = COALESCE ('Ptest@test.com',email),
    author_id = COALESCE ('Ptest',bio),
    published = COALESCE (TRUE ,published)
WHERE id = 6
RETURNING *;

-- DELETE /posts/:id

DELETE FROM posts
WHERE id = 6
RETURNING *;

-- CHECK TABLE AGAIN

SELECT * FROM posts;