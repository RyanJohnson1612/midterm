/*
 * All routes for Customers are defined here
 * Since this file is loaded in server.js into /menus,
 *   these routes are mounted onto /customers
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //Menu Index Page: Present base information of each items on the food_items table
  router.get("/", (req, res) => {
    db.query(
      `SELECT *
       FROM food_items`
    )
      .then((result) => {
        return result.rows;
      })
      .then((result) => {
        res.render("customers/customers-index.ejs", { foodArr: result, ...req.defaultVars });
      })
      .catch((err) => {
        console.log("User Null", err.message);
      });
  });

  //Menu Detailed Page: Linked from clicking on individual food items on the Index Page. This page displays more detail information on the food_item.
  //It has a input box to let user select quantity of the food_item and add it to the Cart
  router.get("/:id", (req, res) => {
    const index = req.params.id - 1;
    db.query(
      `SELECT *
       FROM food_items`
    )
      .then((result) => {
        return result.rows;
      })
      .then((result) => {
        const cartCount = req.cartCount;
        res.render("customers/customers-detail.ejs", { foodArr: result[index], ...req.defaultVars });
      })
      .catch((err) => {
        console.log("User Null", err.message);
      });
  });


  //Menu Quantity Add Action: Add the food_items_id and quantity to the cookie, in req.session.cart as an object

  router.post("/:id/new", (req, res) => {
    const quantity = Number(req.body.quantity);
    const foodID = req.params.id;
    if (req.session.cart) {
      let cart = req.session.cart;
      for (let item of cart) {
        if (item.food_items_id === foodID) {
          item.quantity += quantity;
          res.redirect("/menus");
          return;
        }
      }
      req.session.cart.push({
        food_items_id: foodID,
        quantity: quantity,
      });
      res.redirect("/menus");
    } else {
      req.session.cart = [];
      req.session.cart.push({
        food_items_id: foodID,
        quantity: quantity,
      });
      res.redirect("/menus");
    }
  });

  return router;
};











