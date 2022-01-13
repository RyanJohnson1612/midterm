module.exports = ((req, res, next) => {
  if(req.session.cart) {
    let cartCount = 0;
    for (let item of req.session.cart) {
      cartCount += item.quantity
    }
    req.cartCount = cartCount
  } else {
    req.cartCount = null;
  }
  next();
});
