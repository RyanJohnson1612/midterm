DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);