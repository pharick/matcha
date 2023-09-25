CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER NOT NULL REFERENCES users(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        UNIQUE(user_id, from_user_id)
);
