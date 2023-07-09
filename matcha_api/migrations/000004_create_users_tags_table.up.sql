CREATE TABLE IF NOT EXISTS users_tags (
        user_id INTEGER NOT NULL REFERENCES users(id),
        tag_id INTEGER NOT NULL REFERENCES tags(id)
);
