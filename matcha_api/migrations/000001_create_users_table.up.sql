CREATE TABLE IF NOT EXISTS users(id serial PRIMARY KEY,
                                                   username VARCHAR(100) UNIQUE NOT NULL,
                                                                                name VARCHAR(200) NOT NULL);

