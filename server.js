// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SESSION_KEY_1, process.env.COOKIE_SESSION_KEY_2]
}));

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const restaurantsRoutes = require("./routes/restaurants");
const ordersRoutes = require("./routes/orders");
const customersRoutes = require("./routes/customers");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/orders", ordersRoutes(db));
app.use("/api/restaurants", restaurantsRoutes(db));
app.use("/api/customers", customersRoutes(db))

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/customers", (req, res) => {
  db.query(
    `SELECT *
     FROM food_items`)
  .then((result) => {
    console.log(result.rows)
    return result.rows;
  }).then((result) => {
  res.render('customers/customers-index.ejs', {'foodArr': result})
  }).catch((err) => {
    console.log('User Null', err.message);
  });
});

app.get("/customers/:id", (req, res) => {
  const index = req.params.id - 1;
  console.log('index', index);
  db.query(
    `SELECT *
     FROM food_items`)
  .then((result) => {
    return result.rows;
  }).then((result) => {
    console.log('foodArr', result[index])
    res.render('customers/customers-detail.ejs', {'foodArr': result[index]})
  }).catch((err) => {
    console.log('User Null', err.message);
  });
});

app.get("/", (req, res) => {
  console.log(req.session.restaurant_id);
  if(req.session.restaurant_id) {
    console.log('logged in');
    res.render("index", {'restaurantId': req.session.restaurant_id});
  } else {
    console.log('logged out');
    res.render("index", {'restaurantId': null});
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
