-- Drop and recreate customers table

DROP TABLE IF EXISTS restaurants CASCADE;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL,
  name VARCHAR(255) NOT NULL
);
