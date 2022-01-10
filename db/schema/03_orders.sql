-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  preferred_pickup TIMESTAMP NOT NULL,
  estimated_pickup TIMESTAMP NOT NULL,
  order_date TIMESTAMP NOT NULL DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false
);
