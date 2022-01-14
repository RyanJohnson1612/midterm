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

module.exports = (db, database) => {
  // Get all orders and all required details for orders index,
  // then render views/restaurants/orders_index.ejs with orders data
  // Might remove json_agg query its a bit slow for an index page
  router.get("/", (req, res) => {
    database.getAllOrders()
    .then(orders => {
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
    database.getOrderWithId(req.params.id)
      .then(order => {
        res.render('restaurants/orders_detail.ejs', { order, ...req.defaultVars });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Update order status and send text message to customer
  router.post("/:id/update", (req, res) => {
    // If the restaurant updates the confirmed status and add estimated pickup time
    if (req.body.confirmed) {
      database.confirmOrder([req.body.estimated_pickup, req.params.id])
        .then(() => database.getOrderWithId(req.params.id))
        .then(order => {
          console.log(`Order ${req.params.id} confirmed`);
          const confirmedBody = `Hey ${order.customer_name}, your order from ${order.restaurant_name} has been confirmed and is being prepared! The estimated pickup time is ${order.estimated_pickup}. You'll receive another text message when your order is ready for pickup.`;
          sendMessage(`+1${order.customer_phone_number}`, `+1${order.restaurant_phone_number}`, confirmedBody);
          res.redirect(`/orders/${order.id}`);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      }
      // If the restaurant updates the confirmed status and add estimated pickup time
      if (req.body.completed) {
        database.completeOrder(req.params.id)
          .then(() => database.getOrderWithId(req.params.id))
          .then(order => {
            console.log(`Order ${req.params.id} completed`);
            const completedBody = `Hey ${order.customer_name}, your order from ${order.restaurant_name} is ready for pickup! Order number: #${order.id}`;
            sendMessage(`+1${order.customer_phone_number}`, `+1${order.restaurant_phone_number}`, completedBody);
            res.redirect(`/orders/${order.id}`);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      }
  });
        // const order = results.rows[0];
        // const confirmedBody = `Hey ${order.customer_name}, your order #${order.id} from ${order.restaurant_name} has been confirmed and is being prepared! The estimated pickup time is ${req.body.estimated_pickup}. You'll receive another text message when it your order is ready for pickup.`;
        // const completedBody = `Hey ${order.customer_name}, your order #${order.id} from ${order.restaurant_name} is ready for pickup!`;


          // Test code, will only send text messages to me. So I can feel like I'm popular for once
          // sendMessage(`+16132523300`, `+1${order.restaurant_phone_number}`, confirmedBody);
          // res.redirect(`/orders/${orders.id}`)
        // } else if(isComplete(order)) {
          // update order code goes here
          // sendMessage(`+16477075621`, `+1${order.restaurant_phone_number}`, completeBody);
          // res.redirect(`/orders/${orders.id}`)
        // }

        // Production code
        // const twilioResponse = sendMessage(`+1${order.customer_phone_number}`, `+1${order.restaurant_phone_number}`, body);
        // console.log(twilioResponse);
      // })
  return router;
};
