/*
 * All routes for Cart are defined here
 * Since this file is loaded in server.js into /cart,
 *   these routes are mounted onto /cart
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
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
        res.render('cart/cart', {foodArr: [], ...req.defaultVars});
    }


  });
  return router;
};

//   db.query(`SELECT * FROM food_items;`)
  //     .then((data) => {
  //       const items = data.rows;
  //       // console.log("items", items)
  //       console.log(req.body);

  //       let userData = req.body;
  //       let foodArray = [];

  //       for (let item in userData) {
  //         if (userData[item] !== "") {
  //           foodArray.push({ name: item, quantity: Number(userData[item]) });
  //         }
  //       }

  //       let orderItem = [];
  //       for (let i = 0; i < items.length; i++) {
  //         for (let j = 0; j < foodArray.length; j++) {
  //           if (foodArray[j].name == items[i].name) {
  //             orderItem.push(items[i]);
  //           }
  //         }
  //       }
  //       let quantity = 0;
  //       for (let b = 0; b < foodArray.length; b++) {
  //         quantity += foodArray[b].quantity;
  //       }

  //       console.log(foodArray);

  //       setOrder({ orderItem, foodArray });

  //       res.render("cart/checkout", {
  //         orderItem,
  //         quantity,
  //         foodArray,
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
