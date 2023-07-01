CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        url VARCHAR(200)
);

CREATE UNIQUE INDEX photos_user_id_idx ON photos (user_id);
