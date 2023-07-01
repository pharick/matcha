CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX tags_name_idx ON tags (name);
