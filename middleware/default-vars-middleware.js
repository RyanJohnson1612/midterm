module.exports = ((req, res, next) => {
  const cartCount = req.cartCount;
  const restaurantId = req.session.restaurant_id || null;
  const restaurant = req.session.restaurant || null;

  req.defaultVars = {
    cartCount,
    restaurantId,
    restaurant
  }
  next();
});
