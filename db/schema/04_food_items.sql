-- Drop and recreate food_items table

DROP TABLE IF EXISTS food_items CASCADE;

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  food_name VARCHAR(255) NOT NULL,
  price MONEY NOT NULL,
  picture_url VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  spice_level VARCHAR(32) DEFAULT NULL,
  size VARCHAR(32) DEFAULT 'M'
);
