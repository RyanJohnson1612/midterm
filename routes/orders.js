/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into /orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const { sendMessage } = require("../helpers/sendMessage");
const { json } = require('express');

// Required restaurant to be logged in to access order routes
router.use((req, res, next) => {
  authMiddleware(req, res, next);
});

// Manage order state
// const orderState = (confirmed, completed) => {

// }

module.exports = (db) => {
  // Get all orders and all required details for orders index,
  // then render views/restaurants/orders_index.ejs with orders data
  // Might remove json_agg query its a bit slow for an index page
  router.get("/", (req, res) => {
    db.query(`
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
      ORDER BY order_date;
    `)
    .then(data => {
      orders = data.rows
      res.render('restaurants/orders_index', { orders, ...req.defaultVars });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  // Get details for a single order and all required fields for order detail
  // Create JSON an array of objects food items associated to the order with json_agg and json_build_object
  // Don't ask me to explain how it works, I can't, but it works
  // then render views/restaurants/orders_detail.ejs with order data
  router.get("/:id", (req, res) => {
    db.query(`
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
    `, [req.params.id])
      .then(data => {
        const order = data.rows[0];
        res.render('restaurants/orders_detail.ejs', { order, ...req.defaultVars });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Update order details
  router.post("/:id/update", (req, res) => {
    // Get data for order being updated
    db.query(`
      SELECT
        orders.id,
        confirmed,
        completed,
        customers.name AS customer_name,
        restaurants.name AS restaurant_name,
        customers.phone_number AS customer_phone_number,
        restaurants.phone_number AS restaurant_phone_number
      FROM orders
      JOIN restaurants ON restaurants.id = restaurant_id
      JOIN customers ON customers.id = customer_id
      WHERE orders.id = $1;
    `, [req.params.id])
      .then((results) => {
        const order = results.rows[0];

        // const body = `Hey ${order.customer_name}, your order #${order.id} from ${order.restaurant_name} has been confirmed and is being prepared! The estimated pickup time is ${req.body.estimated_pickup}. You'll receive another text message when it's ready for pickup.`;

        // res.render('restaurants/orders_detail.ejs', { order, ...req.defaultVars });

        // Test code, will only send text messages to me. So I can feel like I'm popular for once
        // const twilioResponse = sendMessage(`+16477075621`, `+1${order.restaurant_phone_number}`, 'Hey Najib! At least I hope that\'s who got this text, it\'s Ryan. @me on discord if you got this, I\'ll join the call then.');

        // Production code
        // const twilioResponse = sendMessage(`+1${order.customer_phone_number}`, `+1${order.restaurant_phone_number}`, body);
        // console.log(twilioResponse);

        // if(req.body.confirmed) {
        //   db.query(`
        //     UPDATE orders
        //     SET estimated_pickup = $1
        //         confirmed = $2
        //     WHERE id = $3
        //   `, [req.body.estimated_pickup, true, req.params.id])
        //     .then(() => {
        //       const body = `Hello ${customer.name} your order from ${restaurant_name} has been confirmed. The estimated pickup time is ${req.body.estimated_pickup}`;
        //       sendMessage('+1' + order.customer_phone_number, '+1' + order.restaurant_phone_number, body);
        //     })
        // }
      })
  });
  return router;
};
