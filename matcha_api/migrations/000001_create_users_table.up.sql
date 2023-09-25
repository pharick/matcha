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
        gender_preferences GENDER[] NOT NULL DEFAULT '{"male", "female", "other"}',
        last_position POINT NOT NULL DEFAULT '(0,0)',
        custom_position POINT NOT NULL DEFAULT '(0,0)',
        biography TEXT,
        rating INTEGER NOT NULL DEFAULT 0,
        last_online TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
        NEW.updated_at = now();
        RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_user_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE INDEX users_username_idx ON users (username);
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_gender_idx ON users (gender);
