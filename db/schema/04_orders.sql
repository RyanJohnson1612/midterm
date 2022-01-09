DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  restaurant_id INTEGER,
  customer_name VARCHAR (255) NOT NULL
  phone_number VARCHAR(32) NOT NULL
  preferred_pickup DATE,
  estimated_pickup DATE,
  order_date DATE NOT NULL,
  confirmed BOOLEAN,
);
