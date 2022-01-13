// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const sassMiddleware = require("./lib/sass-middleware");
const cookieSession = require("cookie-session");
const cartCount = require("./middleware/cart-count-middleware");
const defaultVars = require("./middleware/default-vars-middleware");

// PG database client/connection setup<h1>Your Cart</h1>
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
    source: __dirname + "/sass",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SESSION_KEY_1, process.env.COOKIE_SESSION_KEY_2],
  })
);

app.use(express.static("public"));

// Get the number of items in the cart and add to req variable, null if no cart
// Access this in any route with req.cartCount
// Add it to the template variables inside res.render() to use in ejs template
app.use((req, res, next) =>{ cartCount(req, res, next) });

// Default variables that should be on every page
// Include them in res.render template variables like this: ...req.defaultVars
// Example:
// res.render('view_name', { example: 'variable', ...req.defaultVars})
app.use((req, res, next) => { defaultVars(req, res, next) });

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const restaurantsRoutes = require("./routes/restaurants");
const ordersRoutes = require("./routes/orders");
const customersRoutes = require("./routes/customers");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/orders", ordersRoutes(db));
app.use("/api/restaurants", restaurantsRoutes(db));
app.use("/api/customers", customersRoutes(db));
app.use("/api/cart", cartRoutes(db));
app.use("/api/checkout", checkoutRoutes(db));
// Note: mount other resources here, using the same pattern above
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/customers", (req, res) => {
  db.query(
    `SELECT *
     FROM food_items`
  )
    .then((result) => {
      return result.rows;
    })
    .then((result) => {
      console.log(req.defaultVars);
      res.render("customers/customers-index.ejs", { foodArr: result, ...req.defaultVars });
    })
    .catch((err) => {
      console.log("User Null", err.message);
    });
});

app.get("/customers/:id", (req, res) => {
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
      console.log("foodArr", result[index]);
      res.render("customers/customers-detail.ejs", { foodArr: result[index], ...req.defaultVars });
    })
    .catch((err) => {
      console.log("User Null", err.message);
    });
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});
// customer add quanity to specific food_items
// req.session is an object with following structure: { food_items_id: 'quantity', food_items_id: 'quantity', food_items_id: 'quantity' }
app.post("/customers/:id/new", (req, res) => {
  const quantity = Number(req.body.quantity);
  const foodID = req.params.id;
  console.log("quantity", quantity);
  console.log("foodID", foodID);
  if (req.session.cart) {
    let cart = req.session.cart;
    for (let item of cart) {
      if (item.food_items_id === foodID) {
        item.quantity += quantity;
        console.log("quantity updated", req.session.cart);
        res.redirect("/customers");
        return;
      }
    }

    req.session.cart.push({
      food_items_id: foodID,
      quantity: quantity,
    });
    console.log("add item to cart", req.session.cart);
    res.redirect("/customers");
  } else {
    req.session.cart = [];
    req.session.cart.push({
      food_items_id: foodID,
      quantity: quantity,
    });
    console.log("initialize cart", req.session.cart);
    res.redirect("/customers");
  }
});

// Home page
app.get("/", (req, res) => {
  console.log(req.session.restaurant_id);
  if (req.session.restaurant_id) {
    db.query(
      `SELECT *
      FROM restaurants
      WHERE id = $1`,
      [req.session.restaurant_id]
    ).then((data) => {
      const restaurant = data.rows[0];
      req.session.restaurant = restaurant;
      // Don't add  ...defaultVars in this render function
      res.render("index", {
        restaurantId: req.session.restaurant_id,
        restaurant: restaurant,
        cartCount: req.cartCount
      });
    });
  } else {
    console.log("logged out");
    res.render("index", { ...req.defaultVars });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
