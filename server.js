// load .env data into process.env
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

// Get database query functions
const database = require('./database');

// Web server config
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const sassMiddleware = require("./lib/sass-middleware");
const cookieSession = require("cookie-session");

// Custom middleware
const cartCount = require("./middleware/cart-count-middleware");
const defaultVars = require("./middleware/default-vars-middleware");

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
app.use((req, res, next) => {
  cartCount(req, res, next);
});

// Default variables that should be on every page
// Include them in res.render template variables like this: ...req.defaultVars
// Example:
// res.render('view_name', { example: 'variable', ...req.defaultVars})
app.use((req, res, next) => {
  defaultVars(req, res, next);
});

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const restaurantsRoutes = require("./routes/restaurants");
const ordersRoutes = require("./routes/orders");
const menusRoutes = require("./routes/menus");
const cartRoutes = require("./routes/cart");
const confirmationRoutes = require("./routes/confirmation");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/menus", menusRoutes(db));
app.use("/restaurants", restaurantsRoutes(db));
app.use("/confirmation", confirmationRoutes(database));
app.use("/orders", ordersRoutes(database));
app.use("/cart", cartRoutes(db, database));

// Note: mount other resources here, using the same pattern above
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).



// Home page
app.get("/", (req, res) => {
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
        cartCount: req.cartCount,
      });
    });
  } else {
    res.render("index", { ...req.defaultVars });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
