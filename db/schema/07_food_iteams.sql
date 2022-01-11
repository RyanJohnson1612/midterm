DROP TABLE IF EXISTS food_items CASCADE;

CREATE TABLE food_items (
  food_name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  picture_url VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  spice_level VARCHAR(32) DEFAULT NULL,
  size VARCHAR(32) DEFAULT M
);
