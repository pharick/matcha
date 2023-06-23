CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password_hash VARCHAR(72) NOT NULL,
        first_name VARCHAR(200) NOT NULL,
        last_name VARCHAR(200) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX users_username_idx ON users (username);
CREATE UNIQUE INDEX users_email_idx ON users (email);
