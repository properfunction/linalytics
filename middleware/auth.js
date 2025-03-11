module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/"); // This takes precedence and will take user to index page when clicking h1 unless logged in, then h1 code in header partial will take user to profile
      }
    },
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/dashboard");
      }
    },
  };
  