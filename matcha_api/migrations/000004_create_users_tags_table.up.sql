CREATE TABLE IF NOT EXISTS users_tags (
        user_id INTEGER NOT NULL REFERENCES users(id),
        tag_id INTEGER NOT NULL REFERENCES tags(id)
);

CREATE UNIQUE INDEX users_tags_user_id_idx ON users_tags (user_id);
CREATE UNIQUE INDEX users_tags_tag_id_idx ON users_tags (tag_id);
