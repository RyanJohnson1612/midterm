module.exports = ((req, res, next) => {
  if(!req.session.restaurant_id) {
    res.status(403);
    res.render('error.ejs', { errorMsg: '403 Access Forbidden', ...req.defaultVars})
  }
  next();
});
