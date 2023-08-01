CREATE TABLE IF NOT EXISTS profile_views (
        viewer_id INTEGER NOT NULL REFERENCES users(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        birth_date TIMESTAMP NOT NULL
);
