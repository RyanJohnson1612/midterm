const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const pool = new Pool(dbParams);

/// Orders

/**
 * Get all orders in the database.
 * @param {Number} limit Limits the number of results.
 * @return {Promise<{}>} A promise to the order.
 */
const getAllOrders = (limit = 8) => {
  return pool
    .query(`
      SELECT
        orders.id,
        order_date,
        customers.name,
        customers.phone_number,
        confirmed,
        completed,
        json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity)) AS food_items
      FROM orders
      JOIN customers ON customers.id = customer_id
      JOIN order_food_items ON order_id = orders.id
      JOIN food_items ON food_items.id = food_item_id
      GROUP BY orders.id, customers.name, customers.phone_number
      ORDER BY order_date DESC
      LIMIT $1;
    `, [limit])
    .then((result) => result.rows)
    .catch((err) => err.message)
};
exports.getAllOrders = getAllOrders;

/**
 * Get a single order from the database given its id.
 * @param {string} id The id of the order.
 * @return {Promise<{}>} A promise to the order.
 */
const getOrderWithId = (id) => {
  return pool
    .query(`
      SELECT
        orders.*,
        customers.name AS customer_name,
        customers.phone_number AS customer_phone_number,
        restaurants.name AS restaurant_name,
        restaurants.phone_number AS restaurant_phone_number,
        json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity, 'picture_url', picture_url, 'price', (price * quantity))) AS food_items,
        sum(price * quantity) AS total
      FROM orders
      JOIN restaurants ON restaurants.id = restaurant_id
      JOIN customers ON customers.id = customer_id
      JOIN order_food_items ON order_id = orders.id
      JOIN food_items ON food_items.id = food_item_id
      WHERE orders.id = $1
      GROUP BY orders.id, customers.name, customers.phone_number, restaurants.name, restaurants.phone_number;
    `, [id])
    .then((result) => result.rows[0])
    .catch((err) => err.message)
};
exports.getOrderWithId = getOrderWithId;

/**
 * Set order's status to confirmed.
 * @param {array} queryParams Estimated pickup time and order id
 * @return {Promise<{}>} A promise to the order.
 */
const confirmOrder = (queryParams) => {
  return pool
    .query(`
      UPDATE orders
      SET estimated_pickup = $1,
          confirmed = TRUE
      WHERE id = $2;
    `, queryParams)
    .then((result) => result.rows)
    .catch((err) => err.message)
};
exports.confirmOrder = confirmOrder;

/**
 * Set order's status to confirmed.
 * @param {array} id order id
 * @return {Promise<{}>} A promise to the order.
 */
 const completeOrder = (id) => {
  return pool
    .query(`
      UPDATE orders
      SET completed = TRUE
      WHERE id = $1;
    `, [id])
    .then((result) => result.rows)
    .catch((err) => err.message)
};
exports.completeOrder = completeOrder;

const createCustomer = (name, phoneNumber) => {
  return pool
    .query(`
      INSERT INTO customers (name, phone_number)
      VALUES ($1, $2)
      RETURNING id;
    `,[name, phoneNumber])
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
exports.createCustomer = createCustomer;

const createOrder = (restaurantId, customerId, preferredPickup) => {
  return pool
    .query(`
      INSERT INTO orders (restaurant_id, customer_id, preferred_pickup)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,[restaurantId, customerId, preferredPickup])
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
exports.createOrder = createOrder;

const bridgeOrderFoodItems = (orderId, cart) => {
  let queries = [];
  cart.forEach((item) => {
    queries.push(
      pool.query('INSERT INTO order_food_items (food_item_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING order_id', [item.food_items_id, orderId, item.quantity])
    )
  })

  return Promise.all(queries)
    .then((result) => result[0].rows[0])
    .catch((err) => err.message)
}
exports.bridgeOrderFoodItems = bridgeOrderFoodItems;
