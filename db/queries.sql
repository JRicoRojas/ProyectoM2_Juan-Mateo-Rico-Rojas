-- QUERIES PARA AUTHORS
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