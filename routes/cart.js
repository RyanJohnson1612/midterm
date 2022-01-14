/*
 * All routes for Cart are defined here
 * Since this file is loaded in server.js into /cart,
 *   these routes are mounted onto /cart
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { sendMessage } = require("../helpers/sendMessage");

module.exports = (db, database) => {
  router.get("/", (req, res) => {
    console.log('there is something in the cart', req.session.cart);
    if (req.session.cart) {
      const cart = req.session.cart;
      let queryParams = [];
      let queryString = `
        SELECT *
        FROM food_items
        `;
      for (let item of cart) {
        queryParams.push(item.food_items_id);
        queryString += `${(queryParams.length > 1 ? ' OR' : 'WHERE')} id = $${queryParams.length}`;
      }
      queryString += ';'
      console.log(queryString);
      console.log(queryParams);
      db.query(queryString, queryParams)
        .then((result) => {
          console.log('result.rows', result.rows)
          const foodArr = result.rows.map((arr, i) => {
            return {
              ...result.rows[i],
              quantity: cart[i].quantity,
              total_cost: cart[i].quantity * Number(result.rows[i].price.replace('$', ''))
            }
          });
          let sum = 0;
          for (let item of foodArr) {
            sum += item.total_cost;
          }
          console.log('foodArr', foodArr);

          res.render("cart/cart", { foodArr, sum, ...req.defaultVars });
        })
        .catch((err) => {
          console.log("User Null", err.message);
        });
    } else {
        res.render('cart/cart', {foodArr: [], sum: null, ...req.defaultVars});
    }
  });

  router.post("/create", (req, res) => {
    if(req.session.cart) {
      // Restaurant id is hard coded because there is only one restaurant, change if multiple
      database.createCustomer(req.body.name, req.body.phone_number)
        .then(customer => database.createOrder(1, customer.id, req.body.preferred_pickup))
        .then(order => database.bridgeOrderFoodItems(order.id, req.session.cart))
        .then(order => database.getOrderWithId(order.order_id))
        .then(order => {
          req.session.cart = null;
          // incoming text hard, maybe do later, currently sending the wrong way
          sendMessage(`+1${order.customer_phone_number}`, `+1${order.restaurant_phone_number}`, `Hello ${order.restaurant_name}, a new order has been placed! Check your orders to confirm.`);
          res.redirect(`/confirmation/${order.id}`);
        })
    }
  });

  return router;
};
