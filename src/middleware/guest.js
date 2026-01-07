module.exports = function guest(req, res, next) {
  if (req.session.user) return res.redirect("/notes");
  next();
};
