const passport = require('passport')
const validator = require('validator')
const User = require("../models/User")

module.exports ={
    getLogin: (req, res) => {
        if(req.user) {
            return res.redirect("/profile"); 
        }
        res.render("login", {
            title: "Login",
        })
    },
    getSignup: (req, res) => {
        if(req.user) {
            return res.redirect("/profile") // If user is logged in take them to the profile page
        }
        res.render("signup", {
            title: "Creat Account",
        })
    },
    logout: (req, res) => {
      if (req.session) {
        req.session.regenerate(function(err) {
          if (err) {
            console.log("Error regenerating session:", err);
          }
        });
      }
      req.logout(() => {
        console.log('User has logged out.');
      });
      req.session.destroy((err) => {
        if (err) {
          console.log("Error: Failed to destroy the session during logout.", err);
        }
        req.user = null;
        res.redirect("/");
      });
    },
    postLogin: (req, res, next) => {
      // Use passport.authenticate with a callback
      passport.authenticate('local', (err, user, info) => {
         if (err) {
            return next(err); // Pass error to the next middleware
         }
         if (!user) {
            req.flash('errors', { msg: 'Invalid username or password' });
            return res.redirect('/auth/login');
         }
         req.logIn(user, (err) => {
            if (err) {
               return next(err); // Pass error to the next middleware
            }
            return res.redirect('/profile');
         });
      })(req, res, next); // Pass `req`, `res`, and `next` to the authenticate method
   },
    postSignup: async (req, res, next) => {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
          validationErrors.push({ msg: "Please enter a valid email address." });
        if (!validator.isLength(req.body.password, { min: 8 }))
          validationErrors.push({
            msg: "Password must be at least 8 characters long",
          });
        if (req.body.password !== req.body.confirmPassword)
          validationErrors.push({ msg: "Passwords do not match" });
      
        if (validationErrors.length) {
          req.flash("errors", validationErrors);
          return res.redirect("../auth/signup"); // Make sure to specify auth in the route
        }
        req.body.email = validator.normalizeEmail(req.body.email, {
          gmail_remove_dots: false,
        });
      
        const user = new User({
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
        });
      
        // User.findOne(
        //   { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
        //   (err, existingUser) => {
        //     if (err) {
        //       return next(err);
        //     }
        //     if (existingUser) {
        //       req.flash("errors", {
        //         msg: "Account with that email address or username already exists.",
        //       });
        //       return res.redirect("../signup");
        //     }
        //     user.save((err) => {
        //       if (err) {
        //         return next(err);
        //       }
        //       req.logIn(user, (err) => {
        //         if (err) {
        //           return next(err);
        //         }
        //         res.redirect("/profile");
        //       });
        //     });
        //   }
        // );

        try {
            // Replacing callback-based findOne with async/await
            const existingUser = await User.findOne({
              $or: [{ email: req.body.email }, { userName: req.body.userName }],
            });
        
            if (existingUser) {
              req.flash("errors", {
                msg: "Account with that email address or username already exists.",
              });
              return res.redirect("../signup");
            }
        
            // Using await here as well to handle the promise
            await user.save();
        
            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/profile");
            });
          } catch (err) {
            return next(err);
          }
      }
}