CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        index INTEGER NOT NULL,
        url VARCHAR(200)
);
