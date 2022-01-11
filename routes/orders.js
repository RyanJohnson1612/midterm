/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

      db.query(`
      SELECT orders.id, order_date, customers.name, customers.phone_number, confirmed, completed, json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity)) AS food_items
      FROM orders
      JOIN customers ON customers.id = customer_id
      JOIN order_food_items ON order_id = orders.id
      JOIN food_items ON food_items.id = food_item_id
      GROUP BY orders.id, customers.name, customers.phone_number;
      `)
      .then(data => {
        orders = data.rows
        res.json({ orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT orders.*, customers.name, customers.phone_number, json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity)) AS food_items
    FROM orders
    JOIN customers ON customers.id = customer_id
    JOIN order_food_items ON order_id = orders.id
    JOIN food_items ON food_items.id = food_item_id
    WHERE orders.id = $1
    GROUP BY orders.id, customers.name, customers.phone_number;
    `, [req.params.id])
      .then(data => {
        const order = data.rows[0];
        res.json({ order });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
