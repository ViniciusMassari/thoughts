const checkAuth = (req, res, next) => {
  const userId = req.session.userid;
  if (!userId) res.redirect('/login');
  next();
};

module.exports = checkAuth;
