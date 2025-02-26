module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Please log in to view that resource");
      res.redirect("/auth/login");
    }
  }
};
