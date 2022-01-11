/*
 * All routes for Restaurants are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Restaurant index route
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM restaurants;`)
      .then(data => {
        const restaurants = data.rows;
        res.json({ restaurants });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM restaurants WHERE restaurants.id = $1;`, [req.params.id])
      .then(data => {
        const restaurant = data.rows;
        res.json({ restaurant });
      })
      .catch(err => {
        res
          .status(404)
          .json({ error: err.message });
      });
  });

  // Restuarant login route
  router.post("/login/:id", (req, res) => {
    if(req.params.id) {
      req.session.restaurant_id = req.params.id;
      res.redirect('/');
    }
    res.status(404);
    res.redirect('/');
  });

  // Restaurant logout route
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  return router;
};
