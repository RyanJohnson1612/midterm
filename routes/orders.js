/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const authMiddleware = require("../lib/auth-middleware");

// Required restaurant to be logged in to access order routes
router.use((req, res, next) => {
  authMiddleware(req, res, next);
});

module.exports = (db) => {


  router.get("/", (req, res) => {
    db.query(`
    SELECT orders.id, order_date, customers.name, customers.phone_number, confirmed, completed, json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity)) AS food_items
    FROM orders
    JOIN customers ON customers.id = customer_id
    JOIN order_food_items ON order_id = orders.id
    JOIN food_items ON food_items.id = food_item_id
    GROUP BY orders.id, customers.name, customers.phone_number
    ORDER BY order_date;
    `)
    .then(data => {
      orders = data.rows
      res.render('restaurants/orders_index', { orders });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT orders.*, customers.name AS customer_name, customers.phone_number AS customer_phone_number, restaurants.name AS restaurant_name, restaurants.phone_number AS restaurant_phone_number, json_agg(json_build_object('food_name', food_items.food_name, 'quantity', quantity, 'picture_url', picture_url, 'price', price)) AS food_items, sum(food_items.price) AS total
    FROM orders
    JOIN restaurants ON restaurants.id = restaurant_id
    JOIN customers ON customers.id = customer_id
    JOIN order_food_items ON order_id = orders.id
    JOIN food_items ON food_items.id = food_item_id
    WHERE orders.id = $1
    GROUP BY orders.id, customers.name, customers.phone_number, restaurants.name, restaurants.phone_number;
    `, [req.params.id])
      .then(data => {
        const order = data.rows[0];
        // res.json({order});
        res.render('restaurants/orders_detail.ejs', { order });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
