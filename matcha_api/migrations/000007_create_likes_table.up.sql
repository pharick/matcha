CREATE TABLE IF NOT EXISTS likes (
        user_id INTEGER NOT NULL REFERENCES users(id),
        viewer_id INTEGER NOT NULL REFERENCES users(id)
);
