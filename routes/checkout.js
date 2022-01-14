const express = require("express");
// const { getOrder } = require("../global"); //

const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    let orderItem = getOrder().orderItem;
    let foodArray = getOrder().foodArray;

    let id;

    let query1 =
      "INSERT INTO orders (restaurant_id, customer_id, preferred_pickup, estimated_pickup) VALUES (1, 1, '2021-01-14 13:30:00', '2021-01-14 13:30:00')";
    let values1 = [
      1,
      "In Progress",
      new Date(),
      new Date(new Date().getTime() + 30 * 60000),
    ]; //change 1 to customer id

    db.query(query1, values1)
      .then((data) => {
        id = data.rows[0].id;
        console.log(id);

        for (let i = 0; i < foodArray.length; i++) {
          const food = foodArray[i];
          const order = orderItem[i];

          let query2 =
            "INSERT INTO orders (restaurant_id, customer_id, preferred_pickup, estimated_pickup) VALUES (1, 1, '2021-01-14 13:30:00', '2021-01-14 13:30:00') returning *";
          let values2 = [id, order.id, food.quantity];

          db.query(query2, values2)
            .then((data) => {
              console.log(data.rows);
            })
            .catch((err) => {
              console.log(err);
            });
        }

        res.render("cart/confirmation", {
          orderItem,
          foodArray,
          id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return router;
};
