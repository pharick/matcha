CREATE TABLE IF NOT EXISTS visits (
        user_id INTEGER NOT NULL REFERENCES users(id),
        from_user_id INTEGER NOT NULL REFERENCES users(id),
        UNIQUE(user_id, from_user_id),
        create_time TIMESTAMP NOT NULL DEFAULT NOW()
);
