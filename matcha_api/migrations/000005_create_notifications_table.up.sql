CREATE TYPE NOTIFICATION_TYPE AS ENUM ('visit', 'like', 'unlike', 'match');

CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type NOTIFICATION_TYPE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        from_user_id INTEGER NOT NULL REFERENCES users(id),
        create_time TIMESTAMP NOT NULL DEFAULT NOW(),
        viewed BOOLEAN NOT NULL DEFAULT false
);
