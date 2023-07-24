CREATE TYPE GENDER AS ENUM ('male', 'female', 'other');

CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password_hash VARCHAR(72) NOT NULL,
        first_name VARCHAR(200) NOT NULL,
        last_name VARCHAR(200) NOT NULL,
        birth_date DATE NOT NULL,
        active BOOLEAN NOT NULL DEFAULT false,
        gender GENDER,
        gender_preferences GENDER[] NOT NULL DEFAULT '{}',
        last_position POINT NOT NULL DEFAULT '(0,0)',
        biography TEXT
);

CREATE UNIQUE INDEX users_username_idx ON users (username);
CREATE UNIQUE INDEX users_email_idx ON users (email);
CREATE UNIQUE INDEX users_gender_idx ON users (gender);
