/*
 * All routes for Customers are defined here
 * Since this file is loaded in server.js into api/cusomters,
 *   these routes are mounted onto /customers
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/customers", (req, res) => {
    db.query(`SELECT * FROM customers;`)
      .then(data => {
        console.log('customers')
        const customers = data.rows;
        res.json({ customers });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};


