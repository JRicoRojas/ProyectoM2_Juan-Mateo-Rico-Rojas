CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    email VARCHAR (200) NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    posts_id INTEGER NOT NULL
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (posts_id) REFERENCES posts(id) ON DELETE CASCADE
);
