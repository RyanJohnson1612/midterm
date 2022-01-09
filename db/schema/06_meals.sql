DROP TABLE IF EXISTS meals CASCADE;

CREATE TABLE meals (
  food_name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  picture_url VARCHAR(255) NOT NULL,
  description TEXT,
  spice_level VARCHAR(32),
  size VARCHAR(32)
);
