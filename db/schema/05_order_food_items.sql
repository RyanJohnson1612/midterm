-- Drop and recreate order_food_items table

DROP TABLE IF EXISTS order_food_items CASCADE;

CREATE TABLE order_food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  food_item_id INTEGER REFERENCES food_items(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  quantity SMALLINT
);
